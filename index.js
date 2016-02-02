var buildDefaultsMiddleware = require('express-openapi-defaults');
var buildCoercionMiddleware = require('express-openapi-coercion');
var fsRoutes = require('fs-routes');
var isDir = require('is-dir');
var loggingKey = require('./package.json').name + ': ';
var path = require('path');
var buildValidationMiddleware = require('express-openapi-validation');
var buildResponseValidationMiddleware = require('express-openapi-response-validation');
var validateSchema = require('openapi-schema-validation').validate;

module.exports = {
  initialize: initialize
};

function initialize(args) {
  if (!args) {
    throw new Error(loggingKey + 'args must be an object');
  }

  if (!args.app) {
    throw new Error(loggingKey + 'args.app must be an express app');
  }

  if (!args.apiDoc) {
    throw new Error(loggingKey + 'args.apiDoc is required');
  }

  var exposeApiDocs = 'exposeApiDocs' in args ?
      !!args.exposeApiDocs :
      true;
  var validateApiDoc = 'validateApiDoc' in args ?
      !!args.validateApiDoc :
      true;

  if (validateApiDoc) {
    var apiDocValidation = validateSchema(args.apiDoc);

    if (apiDocValidation.errors.length) {
      console.error(loggingKey, 'Validating schema before populating paths');
      console.error(loggingKey, 'validation errors', JSON.stringify(apiDocValidation.errors, null, '  '));
      throw new Error(loggingKey + 'args.apiDoc was invalid.  See the output.');
    }
  }

  if (typeof args.routes !== 'string') {
    throw new Error(loggingKey + 'args.routes must be a string');
  }

  if (!isDir.sync(args.routes)) {
    throw new Error(loggingKey + 'args.routes was not a path to a directory');
  }

  if (args.docsPath && typeof args.docsPath !== 'string') {
    throw new Error(loggingKey + 'args.docsPath must be a string when given');
  }

  if ('errorTransformer' in args && typeof args.errorTransformer !== 'function') {
    throw new Error(loggingKey + 'args.errorTransformer must be a function when given');
  }

  var app = args.app;
  // Make a copy of the apiDoc that we can safely modify.
  var apiDoc = JSON.parse(JSON.stringify(args.apiDoc));
  var docsPath = args.docsPath || '/api-docs';
  var routesDir = path.resolve(process.cwd(), args.routes);
  var basePath = apiDoc.basePath || '';
  var errorTransformer = args.errorTransformer;

  fsRoutes(routesDir).forEach(function(result) {
    var routeModule = require(result.path);
    var route = result.route;
    // express path pargumentarams start with :paramName
    // openapi path params use {paramName}
    var openapiPath = route;
    var pathMethods = {};
    apiDoc.paths[openapiPath] = pathMethods;

    Object.keys(routeModule).forEach(function(methodName) {
      // methodHandler may be an array or a function.
      var methodHandler = routeModule[methodName];
      var methodDoc = methodHandler.apiDoc;
      var middleware = [].concat(methodHandler);

      if (methodDoc) {
        pathMethods[methodName] = JSON.parse(JSON.stringify(methodDoc));

        if (methodDoc.responses) {
          // it's invalid for a method doc to not have responses, but the post
          // validation will pick it up, so this is almost always going to be added.
          middleware.unshift(buildResponseValidationMiddleware({
            definitions: apiDoc.definitions,
            errorTransformer: errorTransformer,
            responses: methodDoc.responses
          }));
        }

        if (Array.isArray(methodDoc.parameters) && methodDoc.parameters.length) {
          var apiParams = methodDoc.parameters;
          var defaultsMiddleware;

          // no point in default middleware if we don't have any parameters with defaults.
          if (apiParams.filter(byDefault).length) {
            defaultsMiddleware = buildDefaultsMiddleware({parameters: apiParams});
          }

          var coercionMiddleware = buildCoercionMiddleware({parameters: apiParams});
          var validationMiddleware = buildValidationMiddleware({
            errorTransformer: errorTransformer,
            parameters: apiParams,
            schemas: apiDoc.definitions
          });

          middleware.unshift(coercionMiddleware, validationMiddleware);

          if (defaultsMiddleware) {
            middleware.unshift(defaultsMiddleware);
          }
        }
      }

      var expressPath = basePath + '/' +
          route.substring(1).split('/').map(toExpressParams).join('/');
      app[methodName].apply(app, [expressPath].concat(middleware));
    });
  });

  if (validateApiDoc) {
    var apiDocValidation = validateSchema(apiDoc);

    if (apiDocValidation.errors.length) {
      console.error(loggingKey, 'Validating schema after populating paths');
      console.error(loggingKey, 'validation errors', JSON.stringify(apiDocValidation.errors, null, '  '));
      throw new Error(loggingKey + 'args.apiDoc was invalid after populating paths.  See the output.');
    }
  }

  if (exposeApiDocs) {
    // Swagger UI support
    app.get(basePath + docsPath, function(req, res) {
      res.status(200).json(apiDoc);
    });
  }
}

function byDefault(param) {
  return param && 'default' in param;
}

function toExpressParams(part) {
  return part.replace(/^\{([^\{]+)\}$/, ':$1');
}
