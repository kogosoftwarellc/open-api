var JsonschemaValidator = require('jsonschema').Validator;
var LOCAL_DEFINITION_REGEX = /^#\/([^\/]+)\/([^\/]+)$/;

function OpenapiResponseValidator(args) {
  var loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
  if (!args) {
    throw new Error(loggingKey + 'missing args argument');
  }

  if (!args.responses) {
    throw new Error(loggingKey + 'args.responses must be an Object');
  }

  if (!Object.keys(args.responses).length) {
    throw new Error(loggingKey + 'args.responses must contain at least 1 response object');
  }

  var errorTransformer = typeof args.errorTransformer === 'function' &&
      args.errorTransformer;
  var v = new JsonschemaValidator();

  this.schemas = getSchemas(args.responses, args.definitions);
  this.errorMapper = errorTransformer ?
      makeErrorMapper(errorTransformer) :
      toOpenapiValidationError;
  this.v = v;


  if (args.customFormats) {
    Object.keys(args.customFormats).forEach(function(format) {
      var func = args.customFormats[format];
      if (typeof func === 'function') {
        v.customFormats[format] = func;
      }
    });
  }

  if (args.externalSchemas) {
    Object.keys(args.externalSchemas).forEach(function(id) {
      v.addSchema(args.externalSchemas[id], id);
    });
  }
}

OpenapiResponseValidator.prototype.validateResponse = validateResponse;

/**
 * Return a validation error.
 *
 * @param {Number} statusCode
 * @param {*} response
 * @return {Object}
 */
function validateResponse(statusCode, response) {
  var schema;

  if (statusCode && statusCode in this.schemas) {
    schema = this.schemas[statusCode];
  } else if (this.schemas.default) {
    schema = this.schemas.default;
  } else {
    return {
      status: 500,
      message: 'An unknown status code was used and no default was provided.',
    };
  }

  var errors = this.v.validate({
      response: response === undefined ? null : response
    },
    schema).errors;

  if (errors.length) {
    return {
      status: 500,
      message: 'The response was not valid.',
      errors: errors.map(this.errorMapper)
    };
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

module.exports = OpenapiResponseValidator;
