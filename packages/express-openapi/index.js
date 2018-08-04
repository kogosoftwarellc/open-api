var OpenapiFramework = require('openapi-framework').default;
var CASE_SENSITIVE_PARAM_PROPERTY = 'x-express-openapi-case-sensitive';
var loggingKey = require('./package.json').name + ': ';
var normalizeQueryParamsMiddleware = require('express-normalize-query-params-middleware');

module.exports = {
  initialize: initialize
};

var loggingPrefix = 'express-openapi';
function initialize(args) {
  if (!args) {
    throw new Error(`${loggingPrefix}: args must be an object`);
  }

  if (!args.app) {
    throw new Error(`${loggingPrefix}: args.app must be an express app`);
  }

  if (args.routes) {
    console.warn(`${loggingPrefix}: args.routes has been deprecated.  Please use args.paths instead.`);
    if (!args.paths) {
      args.paths = args.routes;
      delete args.routes;
    }
  }

 var exposeApiDocs = 'exposeApiDocs' in args ?
      !!args.exposeApiDocs :
      true;

  if (args.docsPath && typeof args.docsPath !== 'string') {
    throw new Error(loggingKey + 'args.docsPath must be a string when given');
  }

  if ('errorTransformer' in args && typeof args.errorTransformer !== 'function') {
    throw new Error(loggingKey +
        'args.errorTransformer must be a function when given');
  }

  if ('externalSchemas' in args && typeof args.externalSchemas !== 'object') {
    throw new Error(loggingKey +
        'args.externalSchemas must be a object when given');
  }

  if ('securityHandlers' in args && typeof args.securityHandlers !== 'object') {
    throw new Error(loggingKey +
        'args.securityHandlers must be an object when given');
  }

  if ('securityFilter' in args && typeof args.securityFilter !== 'function') {
    throw new Error(loggingKey +
        'args.securityFilter must be a function when given');
  }

  var app = args.app;
  // Do not make modifications to this.
  var docsPath = args.docsPath || '/api-docs';
  var errorTransformer = args.errorTransformer;
  var customFormats = args.customFormats;
  var consumesMiddleware = args.consumesMiddleware;
  var errorMiddleware = typeof args.errorMiddleware === 'function' &&
      args.errorMiddleware.length === 4 ? args.errorMiddleware : null;
  var externalSchemas = args.externalSchemas || {};
  var securityHandlers = args.securityHandlers;
  var promiseMode = !!args.promiseMode;
  var securityFilter = args.securityFilter ? (
    args.promiseMode ?
      toPromiseCompatibleMiddleware(args.securityFilter) :
      args.securityFilter
  ) : function defaultSecurityFilter(req, res, next) {
    res.status(200).json(req.apiDoc);
  };

  // TODO: Use spread once on typescript.
  var frameworkArgs = {
    apiDoc: args.apiDoc,
    customFormats,
    dependencies: args.dependencies,
    errorTransformer,
    externalSchemas,
    featureType: 'middleware',
    name: loggingPrefix,
    paths: args.paths,
    pathSecurity: args.pathSecurity,
    pathsIgnore: args.pathsIgnore,
    routesGlob: args.routesGlob,
    routesIndexFileRegExp: args.routesIndexFileRegExp,
    securityHandlers,
  };

  if ('validateApiDoc' in args) {
    frameworkArgs.validateApiDoc = args.validateApiDoc;
  }

  var framework = new OpenapiFramework(frameworkArgs);

  framework.initialize({
    visitApi: function(ctx) {
      if (exposeApiDocs) {
        // Swagger UI support
        app.get(ctx.basePath + docsPath, function(req, res, next) {
          req.apiDoc = ctx.getApiDoc();
          if (req.apiDoc.swagger) {
            req.apiDoc.host = req.headers.host;
            req.apiDoc.basePath = req.baseUrl + ctx.basePath;
          }
          securityFilter(req, res, next);
        });
      }

      if (errorMiddleware) {
        app.use(ctx.basePath, errorMiddleware);
      }
    },

    visitOperation: function(ctx) {
      var apiDoc = ctx.apiDoc;
      var methodName = ctx.methodName;
      var middleware = [].concat(ctx.additionalFeatures);
      var operationDoc = ctx.operationDoc;
      var operationHandler = ctx.operationHandler;


      if (operationDoc && ctx.allowsFeatures) {
        middleware.unshift(createAssignApiDocMiddleware(apiDoc, operationDoc));

        if (ctx.features.responseValidator) {
          // add response validation middleware
          // it's invalid for a method doc to not have responses, but the post
          // validation will pick it up, so this is almost always going to be added.
          middleware.unshift(function responseValidatorMiddleware(req, res, next) {
            res.validateResponse = function(statusCode, response) {
              return ctx.features.responseValidator.validateResponse(statusCode, response);
            };
            next();
          });
        }

        if (ctx.features.requestValidator) {
          middleware.unshift(function requestValidatorMiddleware(req, res, next) {
            next(ctx.features.requestValidator.validate(req));
          });
        }

        if (ctx.features.coercer) {
          middleware.unshift(function coercerMiddleware(req, res, next) {
            ctx.features.coercer.coerce(req);
            next();
          });
        }

        if (ctx.features.defaultSetter) {
          middleware.unshift(function defaultMiddleware(req, res, next) {
            ctx.features.defaultSetter.handle(req);
            next();
          });
        }

        if (ctx.features.securityHandler) {
          middleware.push(createSecurityMiddleware(ctx.features.securityHandler));
        }

        if (consumesMiddleware && ctx.consumes) {
          addConsumesMiddleware(middleware, consumesMiddleware, ctx.consumes);
        }
      }

      middleware.push(operationHandler);

      optionallyAddQueryNormalizationMiddleware(middleware, ctx.methodParameters);

      if (promiseMode) {
        middleware = [].concat.apply([], middleware).map(toPromiseCompatibleMiddleware);
      }

      var expressPath = ctx.basePath + '/' +
          ctx.path.substring(1).split('/').map(toExpressParams).join('/');
      app[methodName].apply(app, [expressPath].concat(middleware));
    }
  });

  return framework;
}


function addConsumesMiddleware(middleware, consumesMiddleware, consumes) {
  for (var i = consumes.length - 1; i >= 0; --i) {
    var mimeType = consumes[i];
    if (mimeType in consumesMiddleware) {
      var middlewareToAdd = consumesMiddleware[mimeType];
      middleware.unshift(middlewareToAdd);
    }
  }
}

function createAssignApiDocMiddleware(apiDoc, operationDoc) {
  return function assignApiDocMiddleware(req, res, next) {
    req.apiDoc = apiDoc;
    req.operationDoc = operationDoc;
    next();
  };
}

function createSecurityMiddleware(handler) {
  return function securityMiddleware(req, res, next) {
    handler.handle(req, function(err, result) {
      if (err) {
        if (err.challenge) {
          res.set('www-authenticate', err.challenge);
        }
        res.status(err.status);

        if (typeof err.message === 'string') {
          res.send(err.message);
        } else {
          res.json(err.message);
        }

        return;
      }
      next();
    });
  };
}

function optionallyAddQueryNormalizationMiddleware(middleware, methodParameters) {
  if (!methodParameters) {
    return;
  }
  var queryParamsNeedingNormalization = methodParameters.filter(function(param) {
    return param.in === 'query' && param[CASE_SENSITIVE_PARAM_PROPERTY] === false;
  }).map(function(param) {
    return param.name;
  });
  if (queryParamsNeedingNormalization.length) {
    middleware.unshift(normalizeQueryParamsMiddleware(queryParamsNeedingNormalization));
  }
}

function toExpressParams(part) {
  return part.replace(/\{([^}]+)}/g, ':$1');
}

function toPromiseCompatibleMiddleware(fn) {
  if (typeof fn === 'function' && fn.name !== 'expressOpenapiPromiseMiddleware') {
    return function expressOpenapiPromiseMiddleware(req, res, next) {
      var potentialPromise = fn(req, res, next);
      if (potentialPromise && typeof potentialPromise.catch === 'function') {
        potentialPromise.catch(next);
      }
    };
  }
  return fn;
}
