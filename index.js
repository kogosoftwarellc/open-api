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
      errors.push.apply(errors, v.validate(req.body, bodySchema).errors);
    }

    if (req.query && querySchema) {
      errors.push.apply(errors, v.validate(req.query, querySchema).errors);
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

function toOpenapiValidationError(error) {
  return {
    path: error.argument,
    errorCode: error.name + '.openapi.validation',
    message: error.stack
  };
}
