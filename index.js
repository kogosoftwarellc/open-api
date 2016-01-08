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

  var errorTransformer = args.errorTransformer || toOpenapiValidationError;
  var v = new JsonschemaValidator();

  return function(req, res, next) {
    next();
  };
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
