var convert = require('openapi-jsonschema-parameters');
var JsonschemaValidator = require('jsonschema').Validator;
var loggingKey = 'express-openapi-validation';
var LOCAL_DEFINITION_REGEX = /^#\/([^\/]+)\/([^\/]+)$/;

module.exports = validate;

function validate(args) {
  if (!args) {
    throw new Error(loggingKey + ': missing args argument');
  }

  if (!Array.isArray(args.parameters)) {
    throw new Error(loggingKey + ': args.parameters must be an Array');
  }

  var schemas = convert(args.parameters);
  var errorTransformer = args.errorTransformer || toOpenapiValidationError;
  var bodySchema = schemas.body;
  var headersSchema = lowercasedHeaders(schemas.headers);
  var pathSchema = schemas.path;
  var querySchema = schemas.query;
  var v = new JsonschemaValidator();

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

    if (req.body && bodySchema) {
      errors.push.apply(errors, withAddedLocation('body', v.validate(
          req.body, bodySchema).errors));
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
    }

    next(err);
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

    if (headersSchema.required) {
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
