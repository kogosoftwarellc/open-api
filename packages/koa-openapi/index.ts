import OpenapiFramework from 'openapi-framework';

exports = {
  initialize,
};

const loggingPrefix = 'koa-openapi';

function initialize(args) {
  if (!args) {
    throw new Error(`${loggingPrefix}: args must be an object`);
  }

  if (!args.app) {
    throw new Error(`${loggingPrefix}: args.app must be a koa app`);
  }

 const exposeApiDocs = 'exposeApiDocs' in args ?
      !!args.exposeApiDocs :
      true;

  if (args.docsPath && typeof args.docsPath !== 'string') {
    throw new Error(`${loggingPrefix}: args.docsPath must be a string when given`);
  }

  if ('securityFilter' in args && typeof args.securityFilter !== 'function') {
    throw new Error(`${loggingPrefix}: args.securityFilter must be a function when given`);
  }

  const app = args.app;
  // Do not make modifications to this.
  const docsPath = args.docsPath || '/api-docs';
  const consumesMiddleware = args.consumesMiddleware;
  const errorMiddleware = typeof args.errorMiddleware === 'function' &&
      args.errorMiddleware.length === 4 ? args.errorMiddleware : null;
  const securityFilter = args.securityFilter
    || function defaultSecurityFilter(ctx, next) {
      ctx.status = 200;
      ctx.body = ctx.apiDoc;
    };

  // TODO: Use spread once on typescript.
  const frameworkArgs = {
    apiDoc: args.apiDoc,
    featureType: 'middleware',
    name: loggingPrefix,
    paths: args.paths,
  };

  [
    'customFormats',
    'dependencies',
    'errorTransformer',
    'externalSchemas',
    'pathSecurity',
    'pathsIgnore',
    'routesGlob',
    'routesIndexFileRegExp',
    'securityHandlers',
    'validateApiDoc'
  ].forEach(arg => {
    if (arg in args) {
      frameworkArgs[arg] = args[arg];
    }
  });

  const framework = new OpenapiFramework(frameworkArgs);

  framework.initialize({
    visitApi: function(ctx) {
      if (exposeApiDocs) {
        // Swagger UI support
        // TODO convert this to KOA
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
      const apiDoc = ctx.apiDoc;
      const methodName = ctx.methodName;
      const middleware = [].concat(ctx.additionalFeatures);
      const operationDoc = ctx.operationDoc;
      const operationHandler = ctx.operationHandler;


      if (operationDoc && ctx.allowsFeatures) {
        middleware.unshift(createAssignApiDocMiddleware(apiDoc, operationDoc));

        if (ctx.features.responseValidator) {
          // add response validation middleware
          // it's invalid for a method doc to not have responses, but the post
          // validation will pick it up, so this is almost always going to be added.
          // TODO convert this to KOA
          middleware.unshift(function responseValidatorMiddleware(req, res, next) {
            res.validateResponse = function(statusCode, response) {
              return ctx.features.responseValidator.validateResponse(statusCode, response);
            };
            next();
          });
        }

        if (ctx.features.requestValidator) {
          // TODO convert this to KOA
          middleware.unshift(function requestValidatorMiddleware(req, res, next) {
            next(ctx.features.requestValidator.validate(req));
          });
        }

        if (ctx.features.coercer) {
          // TODO convert this to KOA
          middleware.unshift(function coercerMiddleware(req, res, next) {
            ctx.features.coercer.coerce(req);
            next();
          });
        }

        if (ctx.features.defaultSetter) {
          // TODO convert this to KOA
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

      const koaPath = ctx.basePath + '/' +
          ctx.path.substring(1).split('/').map(toPathParams).join('/');
      app[methodName].apply(app, [koaPath].concat(middleware));
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
  // TODO convert this to KOA
  return function assignApiDocMiddleware(req, res, next) {
    req.apiDoc = apiDoc;
    req.operationDoc = operationDoc;
    next();
  };
}

function createSecurityMiddleware(handler) {
  // TODO convert this to KOA
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

function toPathParams(part) {
  return part.replace(/\{([^}]+)}/g, ':$1');
}
