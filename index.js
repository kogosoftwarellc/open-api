var ALL_TRUE_REGEX = /^true(?:,true)*$/;
var async = require('async');
var errorPrefix = require('./package.json').name + ': ';

module.exports = buildOpenapiSecurity;

function buildOpenapiSecurity(securityDefinitions, securityHandlers,
    operationSecurity) {
  if (!securityDefinitions || typeof securityDefinitions !== 'object') {
    throw new Error(errorPrefix + 'securityDefinitions must be an object');
  }

  if (!securityHandlers || typeof securityHandlers !== 'object') {
    throw new Error(errorPrefix + 'securityHandlers must be an object');
  }

  if (!operationSecurity || !Array.isArray(operationSecurity)) {
    throw new Error(errorPrefix + 'operationSecurity must be an Array');
  }

  var securitySets = operationSecurity
    .map(function(security) {
      return Object.keys(security).map(function(scheme) {
        if (!securityDefinitions[scheme]) {
          throw new Error(errorPrefix + 'Unknown security scheme "' + scheme +
              '" used in operation.');
        }

        if (!securityHandlers[scheme]) {
          console.warn(errorPrefix + 'No handler defined for security scheme "' +
              scheme + '"');
          return null;
        }

        if (typeof securityHandlers[scheme] !== 'function') {
          throw new Error(errorPrefix +
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

  if (!securitySets.length) {
    return function(req, res, next) {
      next();
    };
  }

  return function(req, res, next) {
    var lastError;
    async.someLimit(securitySets, 1, function(security, cb) {
      async.parallel(security.map(function(scheme) {
        return function(cb) {
          scheme.handler(req, scheme.scopes, scheme.definition, cb);
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
        return next();
      }

      var message;
      var statusCode;

      if (lastError) {
        message = lastError.message || '';
        statusCode = 500;
        switch (lastError.status) {
          case 401:
            if (!lastError.challenge) {
              message = 'Challenge is a required header with 401 status codes.';
            } else {
              statusCode = 401;
              res.set('www-authenticate', lastError.challenge);
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
        }

        res.status(statusCode);

        if (typeof message === 'string') {
          res.send(message);
        } else {
          res.json(message);
        }

        return;
      }

      next({
        status: 500,
        message: 'No security handlers returned an acceptable response: ' +
            operationSecurity.map(toAuthenticationScheme).join(' OR '),
        errorCode: 'authentication.openapi.security'
      });
    });
  };
}

function toAuthenticationScheme(security) {
  return Object.keys(security).join(' AND ');
}
