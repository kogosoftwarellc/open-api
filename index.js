var buildDefaultsMiddleware = require('express-openapi-defaults');
var buildCoercionMiddleware = require('express-openapi-coercion');
var fsRoutes = require('fs-routes');
var isDir = require('is-dir');
var loggingKey = require('./package.json').name + ': ';
var path = require('path');
var buildValidationMiddleware = require('express-openapi-validation');
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

  var apiDocValidation = validateSchema(args.apiDoc);

  if (apiDocValidation.errors.length) {
    console.error(loggingKey, 'Validating schema before populating paths', args.apiDoc);
    console.error(loggingKey, 'validation errors', apiDocValidation.errors);
    throw new Error(loggingKey + 'args.apiDoc was invalid.  See the output.');
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
    // express path params start with :paramName
    // openapi path params use {paramName}
    var apiPath = basePath + '/' + route.replace(/^\//, '').split('/')
        .map(toOpenapiParams).join('/');
    var pathMethods = {};
    apiDoc.paths[apiPath] = pathMethods;

    Object.keys(routeModule).forEach(function(methodName) {
      // methodHandler may be an array or a function.
      var methodHandler = routeModule[methodName];
      var methodDoc = methodHandler.apiDoc;
      var middleware = [].concat(methodHandler);

      if (methodDoc) {
        pathMethods[methodName] = JSON.parse(JSON.stringify(methodDoc));

        if (Array.isArray(methodDoc.parameters) && methodDoc.parameters.length) {
          var defaultsMiddleware = buildDefaultsMiddleware({parameters: methodDoc.parameters});
          var coercionMiddleware = buildCoercionMiddleware({parameters: methodDoc.parameters});
          var validationMiddleware = buildValidationMiddleware({
            errorTransformer: errorTransformer,
            parameters: methodDoc.parameters,
            schemas: apiDoc.definitions
          });

          middleware.unshift(defaultsMiddleware, coercionMiddleware, validationMiddleware);
        }
      }

      app[methodName].apply(app, [basePath + route].concat(middleware));
    });
  });

  var apiDocValidation = validateSchema(apiDoc);

  if (apiDocValidation.errors.length) {
    console.error(loggingKey, 'Validating schema after populating paths', JSON.stringify(apiDoc, null, '  '));
    console.error(loggingKey, 'validation errors', JSON.stringify(apiDocValidation.errors, null, '  '));
    throw new Error(loggingKey + 'args.apiDoc was invalid after populating paths.  See the output.');
  }

  // Swagger UI support
  app.get(basePath + docsPath, function(req, res) {
    res.status(200).json(apiDoc);
  });
}

function toOpenapiParams(part) {
  if (part[0] === ':') {
    part = '{' + part.substring(1, part.length) + '}';
  }

  return part;
}
