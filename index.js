var convert = require('openapi-jsonschema-parameters');
var jsonschema = require('jsonschema');
var SchemaError = jsonschema.SchemaError;
var JsonschemaValidator = jsonschema.Validator;
var loggingKey = require('./package.json').name + ': ';
var LOCAL_DEFINITION_REGEX = /^#\/([^\/]+)\/([^\/]+)$/;

module.exports = validate;

function validate(args) {
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
  var pathSchema = schemas.path;
  var querySchema = schemas.query;
  var v = new JsonschemaValidator();
  var isBodyRequired = args.parameters.filter(byBodyParameters).length > 0;

  if (args.customFormats) {
    Object.keys(args.customFormats).forEach(function(format) {
      var func = args.customFormats[format];
      if (typeof func === 'function') {
        v.customFormats[format] = func;
      }
    });
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

  return function(req, res, next) {
    var errors = [];
    var err;
    var schemaError;

    if (bodySchema) {
      if (req.body) {
        try {
          var validation = v.validate({body: req.body}, bodyValidationSchema);
          errors.push.apply(errors, withAddedLocation('body', validation.errors));
        } catch(e) {
          e.location = 'body';
          schemaError = e;
        }
      } else {
        schemaError = {
          location: 'body',
          message: 'req.body was not present in the request.  Is a body-parser being used?',
          schema: bodySchema
        };
      }
    }

    if (req.params && pathSchema) {
      errors.push.apply(errors, withAddedLocation('path', v.validate(
          req.params, pathSchema).errors));
    }

    if (req.headers && headersSchema) {
      errors.push.apply(errors, withAddedLocation('headers', v.validate(
          req.headers, headersSchema).errors));
    }

    if (req.query && querySchema) {
      errors.push.apply(errors, withAddedLocation('query', v.validate(
          req.query, querySchema).errors));
    }

    if (errors.length) {
      err = {
        status: 400,
        errors: errors.map(errorMapper)
      };
    } else if (schemaError) {
      err = {
        status: 400,
        errors: [schemaError]
      };
    }

    next(err);
  };
}

function byBodyParameters(param) {
  return param.in === 'body' || param.in === 'formData';
}

function extendedErrorMapper(mapper) {
  return function(jsonSchemaError) {
    return mapper(toOpenapiValidationError(jsonSchemaError), jsonSchemaError);
  };
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
  return stripBodyInfo({
    path: error.property.replace(
              error.location === 'body' ?
              /^instance\.body\.?/ :
              /^instance\.?/, '') || error.argument,
    errorCode: error.name + '.openapi.validation',
    message: error.stack,
    location: error.location
  });
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
  if (errors) {
    errors.forEach(function(error) {
      error.location = location;
    });
  }

  return errors;
}
