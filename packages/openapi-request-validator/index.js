var convert = require('openapi-jsonschema-parameters');
var Ajv = require('ajv');
var LOCAL_DEFINITION_REGEX = /^#\/([^\/]+)\/([^\/]+)$/;

function OpenapiRequestValidator(args) {
  var loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
  if (!args) {
    throw new Error(loggingKey + 'missing args argument');
  }

  if (!Array.isArray(args.parameters)) {
    throw new Error(loggingKey + 'args.parameters must be an Array');
  }

  var schemas = convert(args.parameters);
  var errorTransformer = typeof args.errorTransformer === 'function' &&
                         args.errorTransformer;
  var errorMapper = errorTransformer ?
    extendedErrorMapper(errorTransformer) :
    toOpenapiValidationError;
  var bodySchema = schemas.body;
  var bodyValidationSchema;
  var headersSchema = lowercasedHeaders(schemas.headers);
  var formDataSchema = schemas.formData;
  var pathSchema = schemas.path;
  var querySchema = schemas.query;
  var v = new Ajv({allErrors: true, unknownFormats: 'ignore', missingRefs: 'fail', logger: false});
  var isBodyRequired = args.parameters.filter(byRequiredBodyParameters).length > 0;

  if (args.customFormats) {
    var hasNonFunctionProperty;
    Object.keys(args.customFormats).forEach(function(format) {
      var func = args.customFormats[format];
      if (typeof func === 'function') {
        v.addFormat(format, func);
      } else {
        hasNonFunctionProperty = true;
      }
    });
    if (hasNonFunctionProperty) {
      throw new Error(loggingKey + 'args.customFormats properties must be functions');
    }
  }

  if (bodySchema) {
    bodyValidationSchema = {
      properties: {
        body: bodySchema
      }
    };
  }

  if (args.schemas) {
    if (Array.isArray(args.schemas)) {
      args.schemas.forEach(function(schema) {
        var id = schema.id;

        if (id) {
          var localSchemaPath = LOCAL_DEFINITION_REGEX.exec(id);

          if (localSchemaPath && bodyValidationSchema) {
            var definitions = bodyValidationSchema[localSchemaPath[1]];

            if (!definitions) {
              definitions = bodyValidationSchema[localSchemaPath[1]] = {};
            }

            definitions[localSchemaPath[2]] = schema;
          }

          v.addSchema(schema, id);
        } else {
          console.warn(loggingKey, 'igorning schema without id property');
        }
      });
    } else if (bodySchema) {
      bodyValidationSchema.definitions = args.schemas;
    }
  }

  if (args.externalSchemas) {
    Object.keys(args.externalSchemas).forEach(function(id) {
      v.addSchema(args.externalSchemas[id], id);
    });
  }

  this.bodySchema = bodySchema;
  this.errorMapper = errorMapper;
  this.isBodyRequired = isBodyRequired;
  this.validateBody = bodyValidationSchema && v.compile(bodyValidationSchema);
  this.validateFormData = formDataSchema && v.compile(formDataSchema);
  this.validateHeaders = headersSchema && v.compile(headersSchema);
  this.validatePath = pathSchema && v.compile(pathSchema);
  this.validateQuery = querySchema && v.compile(querySchema);
}

OpenapiRequestValidator.prototype.validate = function validate(request) {
  var errors = [];
  var err;
  var schemaError;

  if (this.bodySchema) {
    if (request.body) {
      if (!this.validateBody({body: request.body})) {
        errors.push.apply(errors, withAddedLocation('body', this.validateBody.errors));
      }
    } else if (this.isBodyRequired) {
      schemaError = {
        location: 'body',
        message: 'request.body was not present in the request.  Is a body-parser being used?',
        schema: this.bodySchema
      };
    }
  }

  if (this.validateFormData && !schemaError) {
    if (!this.validateFormData(request.body)) {
      errors.push.apply(errors, withAddedLocation('formData', this.validateFormData.errors));
    }
  }

  if (this.validatePath) {
    if (!this.validatePath(request.params || {})) {
      errors.push.apply(errors, withAddedLocation('path', this.validatePath.errors));
    }
  }

  if (this.validateHeaders) {
    if (!this.validateHeaders(lowercaseRequestHeaders(request.headers || {}))) {
      errors.push.apply(errors, withAddedLocation('headers', this.validateHeaders.errors));
    }
  }

  if (this.validateQuery) {
    if (!this.validateQuery(request.query || {})) {
      errors.push.apply(errors, withAddedLocation('query', this.validateQuery.errors));
    }
  }

  if (errors.length) {
    err = {
      status: 400,
      errors: errors.map(this.errorMapper)
    };
  } else if (schemaError) {
    err = {
      status: 400,
      errors: [schemaError]
    };
  }

  return err;
};

function byRequiredBodyParameters(param) {
  return (param.in === 'body' || param.in === 'formData') && param.required;
}

function extendedErrorMapper(mapper) {
  return function(ajvError) {
    return mapper(toOpenapiValidationError(ajvError), ajvError);
  };
}

function lowercaseRequestHeaders(headers) {
  var lowerCasedHeaders = {};
  Object.keys(headers).forEach(header => {
    lowerCasedHeaders[header.toLowerCase()] = headers[header];
  });
  return lowerCasedHeaders;
}

function lowercasedHeaders(headersSchema) {
  if (headersSchema) {
    var properties = headersSchema.properties;
    Object.keys(properties).forEach(function(header) {
      var property = properties[header];
      delete properties[header];
      properties[header.toLowerCase()] = property;
    });

    if (headersSchema.required && headersSchema.required.length) {
      headersSchema.required = headersSchema.required.map(function(header) {
        return header.toLowerCase();
      });
    }
  }

  return headersSchema;
}

function toOpenapiValidationError(error) {
  var validationError = {
    path: 'instance' + error.dataPath,
    errorCode: error.keyword + '.openapi.validation',
    message: error.message,
    location: error.location
  };

  if (error.keyword === '$ref') {
    delete validationError.errorCode;
    validationError.schema = {'$ref': error.params.ref};
  }

  if (error.params.missingProperty) {
    validationError.path += '.' + error.params.missingProperty;
  }

  validationError.path = validationError.path.replace(
      error.location === 'body' ?
      /^instance\.body\.?/ :
      /^instance\.?/, '');

  if (!validationError.path) {
    delete validationError.path;
  }

  return stripBodyInfo(validationError);
}

function stripBodyInfo(error) {
  if (error.location === 'body') {
    if (typeof error.path === 'string') {
      error.path = error.path.replace(/^body\./, '');
    } else {
      // Removing to avoid breaking clients that are expecting strings.
      delete error.path;
    }

    error.message = error.message.replace(/^instance\.body\./, 'instance.');
    error.message = error.message.replace(/^instance\.body /, 'instance ');
  }

  return error;
}

function withAddedLocation(location, errors) {
  errors.forEach(function(error) {
    error.location = location;
  });

  return errors;
}

module.exports = OpenapiRequestValidator;
