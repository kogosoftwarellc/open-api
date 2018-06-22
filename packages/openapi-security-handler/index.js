var ALL_TRUE_REGEX = /^true(?:,true)*$/;
var async = require('async');

function OpenapiSecurityHandler(args) {
  var loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
  if (!args) {
    throw new Error(loggingKey + 'missing args argument');
  }

  var securityDefinitions = args.securityDefinitions;
  var securityHandlers = args.securityHandlers;
  var operationSecurity = args.operationSecurity;

  if (!securityDefinitions || typeof securityDefinitions !== 'object') {
    throw new Error(loggingKey + 'securityDefinitions must be an object');
  }

  if (!securityHandlers || typeof securityHandlers !== 'object') {
    throw new Error(loggingKey + 'securityHandlers must be an object');
  }

  if (!operationSecurity || !Array.isArray(operationSecurity)) {
    throw new Error(loggingKey + 'operationSecurity must be an Array');
  }

  this.operationSecurity = operationSecurity;
  this.securitySets = operationSecurity
    .map(function(security) {
      return Object.keys(security).map(function(scheme) {
        if (!securityDefinitions[scheme]) {
          throw new Error(loggingKey + 'Unknown security scheme "' + scheme +
              '" used in operation.');
        }

        if (!securityHandlers[scheme]) {
          console.warn(loggingKey + 'No handler defined for security scheme "' +
              scheme + '"');
          return null;
        }

        if (typeof securityHandlers[scheme] !== 'function') {
          throw new Error(loggingKey +
              'Security handlers must be functions.  Non function ' +
              'given for scheme "' + scheme + '"');

        }

        return {
          definition: securityDefinitions[scheme],
          handler: securityHandlers[scheme],
          scopes: security[scheme]
        };
      })
      .filter(function(security) {
        return !!security;
      });
    })
    .filter(function(set) {
      return set.length > 0;
    });

  if (!this.securitySets.length) {
    this.handle = function(request, cb) {
      cb(null, true);
    };
  }
}

OpenapiSecurityHandler.prototype.handle = function(request, cb) {
  var lastError;
  var operationSecurity = this.operationSecurity;
  async.someLimit(this.securitySets, 1, function(security, cb) {
    async.parallel(security.map(function(scheme) {
      return function(cb) {
        scheme.handler(request, scheme.scopes, scheme.definition, cb);
      };
    }), function(err, results) {
      lastError = err;

      if (err) {
        return cb(false);
      }

      cb(ALL_TRUE_REGEX.test(results.join()));
    });
  }, function(result) {
    if (result) {
      return cb(null, true);
    }

    var message;
    var statusCode;

    if (lastError) {
      var error = {};
      message = lastError.message || '';
      statusCode = 500;
      switch (lastError.status) {
        case 401:
          if (!lastError.challenge) {
            message = 'Challenge is a required header with 401 status codes.';
          } else {
            error.challenge = lastError.challenge;
            statusCode = 401;
          }
          break;
        case 403:
          statusCode = 403;
          if (lastError.message) {
            message = lastError.message;
          } else {
            message = 'Your access to this resource is forbidden.';
          }
          break;
        case 400:
          statusCode = 400;
            if (lastError.message) {
                message = lastError.message;
            } else {
                message = 'Bad request.';
            }
            break;
      }

      if (lastError.challenge) {
        error.challenge = lastError.challenge;
      }

      error.message = message;
      error.status = statusCode;

      return cb(error, false);
    }

    cb({
      status: 500,
      message: 'No security handlers returned an acceptable response: ' +
          operationSecurity.map(toAuthenticationScheme).join(' OR '),
      errorCode: 'authentication.openapi.security'
    }, false);
  });
};

function toAuthenticationScheme(security) {
  return Object.keys(security).join(' AND ');
}

module.exports = OpenapiSecurityHandler;
