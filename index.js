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
  var errorTransformer = args.errorTransformer || toOpenapiValidationError;
  var bodySchema = schemas.body;
  var headersSchema = lowercasedHeaders(schemas.headers);
  var pathSchema = schemas.path;
  var querySchema = schemas.query;
  var v = new JsonschemaValidator();
  var isBodyRequired = args.parameters.filter(byBodyParameters).length > 0;

  if (Array.isArray(args.schemas)) {
    args.schemas.forEach(function(schema) {
      var id = schema.id;

      if (id) {
        var localSchemaPath;

        if (bodySchema) {
          localSchemaPath = LOCAL_DEFINITION_REGEX.exec(id);
        }

        if (localSchemaPath) {
          var localSchemas = bodySchema[localSchemaPath[1]];

          if (!localSchemas) {
            localSchemas = bodySchema[localSchemaPath[1]] = {};
          }

          localSchemas[localSchemaPath[2]] = schema;
        }

        v.addSchema(schema, id);
      } else {
        console.warn(loggingKey, 'igorning schema without id property');
      }
    });
  }

  return function(req, res, next) {
    var errors = [];
    var err;
    var schemaError;

    if (bodySchema) {
      if (req.body) {
        try {
          var validation = v.validate(req.body, bodySchema);
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
        errors: errors.map(errorTransformer)
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
  return {
    path: error.property.replace(/^instance\.?/, '') || error.argument,
    errorCode: error.name + '.openapi.validation',
    message: error.stack,
    location: error.location
  };
}

function withAddedLocation(location, errors) {
  if (errors) {
    errors.forEach(function(error) {
      error.location = location;
    });
  }

  return errors;
}
