var convert = require('openapi-jsonschema-parameters');
var JsonschemaValidator = require('jsonschema').Validator;

module.exports = validate;

function validate(parameters, definitions) {
  var schemas = convert(parameters);
  var bodySchema = schemas.body;
  var pathSchema = schemas.path;
  var querySchema = schemas.query;
  var v = new JsonschemaValidator();

  if (Array.isArray(definitions)) {
    definitions.forEach(function(definition) {
      if (definition.id) {
        validator.addSchema(definition, definition.id);
      }
    });
  }

  return function(req, res, next) {
    var errors = [];
    var err;

    if (req.query && querySchema) {
      errors.push.apply(errors, v.validate(req.query, querySchema).errors);
    }

    if (errors.length) {
      err = {
        status: 400,
        errors: errors.map(toOpenapiValidationError)
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
