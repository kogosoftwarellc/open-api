var Ajv = require('ajv');
var LOCAL_DEFINITION_REGEX = /^#\/([^\/]+)\/([^\/]+)$/;

// Source: https://swagger.io/specification/#dataTypes
// TODO: implement custom format validators for these data types
var OPENAPI_FORMATS = ['int32', 'int64', 'float', 'double', 'byte', 'binary', 'date', 'date-time', 'password'];

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
  var v = new Ajv({allErrors: true, unknownFormats: OPENAPI_FORMATS, missingRefs: 'fail', logger: false});

  this.errorMapper = errorTransformer ?
      makeErrorMapper(errorTransformer) :
      toOpenapiValidationError;

  if (args.customFormats) {
    Object.keys(args.customFormats).forEach(function(format) {
      var func = args.customFormats[format];
      if (typeof func === 'function') {
        v.addFormat(format, func);
      }
    });
  }

  if (args.externalSchemas) {
    Object.keys(args.externalSchemas).forEach(function(id) {
      v.addSchema(args.externalSchemas[id], id);
    });
  }

  var schemas = getSchemas(args.responses, args.definitions);
  this.validators = compileValidators(v, schemas);
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
  var validator;

  if (statusCode && statusCode in this.validators) {
    validator = this.validators[statusCode];
  } else if (this.validators.default) {
    validator = this.validators.default;
  } else {
    return {
      status: 500,
      message: 'An unknown status code was used and no default was provided.',
    };
  }

  var isValid = validator({
    response: response === undefined ? null : response
  });

  if (!isValid) {
    return {
      status: 500,
      message: 'The response was not valid.',
      errors: validator.errors.map(this.errorMapper)
    };
  }
}

function compileValidators(v, schemas) {
  var validators = {};

  Object.keys(schemas).forEach(function(name) {
    validators[name] = v.compile(schemas[name]);
  });

  return validators;
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
      definitions: definitions || {}
    };
  });

  return schemas;
}

function makeErrorMapper(mapper) {
  return function(ajvError) {
    return mapper(toOpenapiValidationError(ajvError), ajvError);
  };
}

function toOpenapiValidationError(error) {
  var validationError = {
    path: 'instance' + error.dataPath,
    errorCode: error.keyword + '.openapi.responseValidation',
    message: error.message
  };

  validationError.path = validationError.path.replace(/^instance\.(?:response\.)?/, '');

  validationError.message = validationError.path + ' ' + validationError.message;

  if (validationError.path === 'response') {
    delete validationError.path;
  }

  return validationError;
}

module.exports = OpenapiResponseValidator;
