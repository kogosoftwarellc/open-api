var JsonschemaValidator = require('jsonschema').Validator;
var loggingKey = require('./package.json').name + ': ';
var LOCAL_DEFINITION_REGEX = /^#\/([^\/]+)\/([^\/]+)$/;

module.exports = validateResponseMiddlewareFactory;

function validateResponseMiddlewareFactory(args) {
  if (!args) {
    throw new Error(loggingKey + 'missing args argument');
  }

  if (!args.responses) {
    throw new Error(loggingKey + 'args.responses must be an Object');
  }

  if (!Object.keys(args.responses).length) {
    throw new Error(loggingKey + 'args.responses must contain at least 1 response object');
  }

  var schemas = getSchemas(args.responses, args.definitions);
  var errorTransformer = typeof args.errorTransformer === 'function' &&
      args.errorTransformer;
  var errorMapper = errorTransformer ?
      makeErrorMapper(errorTransformer) :
      toOpenapiValidationError;

  var definitions = args.definitions;
  var v = new JsonschemaValidator();

  return function(req, res, next) {
    res.validateResponse = validateResponse;
    next();
  };

  /**
   * Return a validation error.
   *
   * @param {Number} statusCode
   * @param {*} response
   * @return {Object}
   */
  function validateResponse(statusCode, response) {
    var schema;

    if (statusCode && statusCode in schemas) {
      schema = schemas[statusCode];
    } else if (schemas.default) {
      schema = schemas.default;
    } else {
      return {
        status: 500,
        message: 'An unknown status code was used and no default was provided.',
      };
    }

    var errors = v.validate({
        response: response === undefined ? null : response
      },
      schema).errors;

    if (errors.length) {
      return {
        status: 500,
        message: 'The response was not valid.',
        errors: errors.map(errorMapper)
      };
    }
  }
}

function getSchemas(responses, definitions) {
  var schemas = {};

  Object.keys(responses).forEach(function(name) {
    var response = responses[name];
    var schema = response && response.schema;

    schemas[name] = {
      $schema: 'http://json-schema.org/schema#',
      type: 'object',
      properties: {
        response: schema || {type: "null"}
      },
      definitions: definitions
    };
  });

  return schemas;
}

function makeErrorMapper(mapper) {
  return function(jsonschemaError) {
    return mapper(toOpenapiValidationError(jsonschemaError), jsonschemaError);
  };
}

function toOpenapiValidationError(error) {
  var path = error.property.replace(/^instance\.(?:response\.)?/, '') || error.argument;
  var error = {
    path: path,
    errorCode: error.name + '.openapi.responseValidation',
    message: path + ' ' + error.message
  };

  if (error.path === 'response') {
    delete error.path;
  }

  return error;
}
