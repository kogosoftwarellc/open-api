var ADDITIONAL_MIDDLEWARE_PROPERTY = 'x-express-openapi-additional-middleware';
var buildDefaultsMiddleware = require('express-openapi-defaults');
var buildCoercionMiddleware = require('express-openapi-coercion');
var fsRoutes = require('fs-routes');
var INHERIT_ADDITIONAL_MIDDLEWARE_PROPERTY = 'x-express-openapi-inherit-additional-middleware';
var CASE_SENSITIVE_PARAM_PROPERTY = 'x-express-openapi-case-sensitive';
var isDir = require('is-dir');
var loggingKey = require('./package.json').name + ': ';
var path = require('path');
var buildValidationMiddleware = require('express-openapi-validation');
var buildResponseValidationMiddleware = require('express-openapi-response-validation');
var buildSecurityMiddleware = require('express-openapi-security');
var PARAMETER_REF_REGEX = /^#\/parameters\/(.+)$/;
var RESPONSE_REF_REGEX = /^#\/(definitions|responses)\/(.+)$/;
var validateSchema = require('openapi-schema-validation').validate;
var normalizeQueryParamsMiddleware = require('express-normalize-query-params-middleware');
var METHOD_ALIASES = {
  // HTTP style
  DELETE: 'delete',
  GET: 'get',
  HEAD: 'head',
  OPTIONS: 'options',
  PATCH: 'patch',
  POST: 'post',
  PUT: 'put',

  // js style
  del: 'delete',
  delete: 'delete',
  get: 'get',
  head: 'head',
  options: 'options',
  patch: 'patch',
  post: 'post',
  put: 'put'
};

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

  if (args.routes) {
    console.warn(loggingKey, 'args.routes has been deprecated.  Please use args.paths instead.');
    if (!args.paths) {
      args.paths = args.routes;
      delete args.routes;
    }
  }

  var paths = [].concat(args.paths);
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
      console.error(loggingKey, 'validation errors',
          JSON.stringify(apiDocValidation.errors, null, '  '));
      throw new Error(loggingKey + 'args.apiDoc was invalid.  See the output.');
    }
  }

  if (!paths.filter(byString).length) {
    throw new Error(loggingKey + 'args.paths must be a string or an array of strings');
  }

  paths = paths.map(toAbsolutePath);

  if (!paths.filter(byDirectory).length) {
    throw new Error(loggingKey + 'args.paths contained a value that was not a path to a directory');
  }

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

  var app = args.app;
  // Do not make modifications to this.
  var originalApiDoc = args.apiDoc;
  // Make a copy of the apiDoc that we can safely modify.
  var apiDoc = copy(args.apiDoc);
  var docsPath = args.docsPath || '/api-docs';
  var basePath = apiDoc.basePath || '';
  var errorTransformer = args.errorTransformer;
  var customFormats = args.customFormats;
  var consumesMiddleware = args.consumesMiddleware;
  var errorMiddleware = typeof args.errorMiddleware === 'function' &&
      args.errorMiddleware.length === 4 ? args.errorMiddleware : null;
  var parameterDefinitions = apiDoc.parameters || {};
  var externalSchemas = args.externalSchemas || {};
  var securityHandlers = args.securityHandlers;
  var apiSecurityMiddleware = securityHandlers &&
                              apiDoc.security &&
                              apiDoc.securityDefinitions ?
      buildSecurityMiddleware(apiDoc.securityDefinitions, securityHandlers,
          apiDoc.security) :
      null;
  var pathSecurity = Array.isArray(args.pathSecurity) ?
      args.pathSecurity :
      [];

  pathSecurity.forEach(assertRegExpAndSecurity);

  var loadPathModule = args.dependencies ? function (path) {
    return dependencyInjection(args.dependencies, require(path));
  } : function (path) {
      return require(path);
  };
  [].concat.apply([], paths.map(fsRoutes)).sort(byRoute).forEach(function(result) {
    var pathModule = loadPathModule(result.path);
    var route = result.route;
    // express path params start with :paramName
    // openapi path params use {paramName}
    var openapiPath = route;
    // Do not make modifications to this.
    var originalPathItem = originalApiDoc.paths[openapiPath] || {};
    var pathItem = apiDoc.paths[openapiPath] || {};
    var pathParameters = Array.isArray(pathModule.parameters) ?
        [].concat(pathModule.parameters) :
        [];
    pathItem.parameters = pathParameters;
    apiDoc.paths[openapiPath] = pathItem;

    Object.keys(pathModule).filter(byMethods).forEach(function(methodName) {
      // operationHandler may be an array or a function.
      var operationHandler = pathModule[methodName];
      var operationDoc = getMethodDoc(operationHandler);
      var middleware = [].concat(getAdditionalMiddleware(originalApiDoc, originalPathItem,
            pathModule, operationDoc));
      (operationDoc && operationDoc.tags || []).forEach(addOperationTagToApiDoc
          .bind(null, apiDoc));

      methodName = METHOD_ALIASES[methodName];

      if (operationDoc &&
          allowsMiddleware(apiDoc, pathModule, pathItem, operationDoc)) {
        // add middleware
        pathItem[methodName] = copy(operationDoc);
        var consumes = Array.isArray(operationDoc.consumes) ?
          operationDoc.consumes :
          Array.isArray(apiDoc.consumes) ?
          apiDoc.consumes :
          null;

        middleware.unshift(createAssignApiDocMiddleware(apiDoc, operationDoc));

        if (operationDoc.responses && allowsResponseValidationMiddleware(apiDoc,
              pathModule, pathItem, operationDoc)) {
          // add response validation middleware
          // it's invalid for a method doc to not have responses, but the post
          // validation will pick it up, so this is almost always going to be added.
          middleware.unshift(buildResponseValidationMiddleware({
            definitions: apiDoc.definitions,
            externalSchemas: externalSchemas,
            errorTransformer: errorTransformer,
            responses: resolveResponseRefs(operationDoc.responses, apiDoc, result.path),
            customFormats: customFormats
          }));
        }

        var methodParameters = withNoDuplicates(resolveParameterRefs(
          Array.isArray(operationDoc.parameters) ?
          pathParameters.concat(operationDoc.parameters) :
          pathParameters, parameterDefinitions));

        if (methodParameters.length) {
          // defaults, coercion, and parameter validation middleware
          if (allowsValidationMiddleware(apiDoc, pathModule, pathItem, operationDoc)) {
            var validationMiddleware = buildValidationMiddleware({
              errorTransformer: errorTransformer,
              parameters: methodParameters,
              schemas: apiDoc.definitions,
              externalSchemas: externalSchemas,
              customFormats: customFormats
            });
            middleware.unshift(validationMiddleware);
          }

          if (allowsCoercionMiddleware(apiDoc, pathModule, pathItem, operationDoc)) {
            var coercionMiddleware = buildCoercionMiddleware({parameters: methodParameters});
            middleware.unshift(coercionMiddleware);
          }

          // no point in default middleware if we don't have any parameters with defaults.
          if (methodParameters.filter(byDefault).length &&
              allowsDefaultsMiddleware(apiDoc, pathModule, pathItem, operationDoc)) {
            var defaultsMiddleware = buildDefaultsMiddleware({parameters: methodParameters});
            middleware.unshift(defaultsMiddleware);
          }
        }

        var securityMiddleware;
        var securityDefinition;

        if (securityHandlers && apiDoc.securityDefinitions) {
          if (operationDoc.security) {
            securityDefinition = operationDoc.security;
          } else if (pathSecurity.length) {
            securityDefinition = getSecurityDefinitionByPath(openapiPath, pathSecurity);
          }
        }

        if (securityDefinition) {
          pathItem[methodName].security = securityDefinition;
          securityMiddleware = buildSecurityMiddleware(apiDoc.securityDefinitions,
              securityHandlers, securityDefinition);
        } else if (apiSecurityMiddleware) {
          securityMiddleware = apiSecurityMiddleware;
        }

        if (securityMiddleware) {
          middleware.push(securityMiddleware);
        }

        if (consumesMiddleware && consumes) {
          addConsumesMiddleware(middleware, consumesMiddleware, consumes);
        }
      }

      middleware.push(operationHandler);

      optionallyAddQueryNormalizationMiddleware(middleware, methodParameters);

      var expressPath = basePath + '/' +
          route.substring(1).split('/').map(toExpressParams).join('/');
      app[methodName].apply(app, [expressPath].concat(middleware));
    });
  });

  sortApiDocTags(apiDoc);

  if (validateApiDoc) {
    var apiDocValidation = validateSchema(apiDoc);

    if (apiDocValidation.errors.length) {
      console.error(loggingKey, 'Validating schema after populating paths');
      console.error(loggingKey, 'validation errors',
          JSON.stringify(apiDocValidation.errors, null, '  '));
      throw new Error(loggingKey +
          'args.apiDoc was invalid after populating paths.  See the output.');
    }
  }

  if (exposeApiDocs) {
    // Swagger UI support
    app.get(basePath + docsPath, function(req, res) {
      apiDoc.basePath = req.baseUrl + basePath;
      res.status(200).json(apiDoc);
    });
  }

  if (errorMiddleware) {
    app.use(basePath, errorMiddleware);
  }

  var initializedApi = {
    apiDoc: apiDoc
  };

  return initializedApi;
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

function addOperationTagToApiDoc(apiDoc, tag) {
  var apiDocTags = (apiDoc.tags || []);
  var availableTags = apiDocTags.map(function(tag) {
    return tag && tag.name;
  });

  if (availableTags.indexOf(tag) === -1) {
    apiDocTags.push({
      name: tag
    });
  }

  apiDoc.tags = apiDocTags;
}

function allows(args, prop, val) {
  return ![].slice.call(args).filter(byProperty(prop, val))
    .length;
}

function allowsMiddleware() {
  return allows(arguments, 'x-express-openapi-disable-middleware', true);
}

function allowsCoercionMiddleware() {
  return allows(arguments, 'x-express-openapi-disable-coercion-middleware', true);
}

function allowsDefaultsMiddleware() {
  return allows(arguments, 'x-express-openapi-disable-defaults-middleware', true);
}

function allowsResponseValidationMiddleware() {
  return allows(arguments, 'x-express-openapi-disable-response-validation-middleware',
      true);
}

function allowsValidationMiddleware() {
  return allows(arguments, 'x-express-openapi-disable-validation-middleware', true);
}

function assertRegExpAndSecurity(tuple) {
  if (!Array.isArray(tuple)) {
    throw new Error(loggingKey + 'args.pathSecurity expects an array of tuples.');
  } else if (!(tuple[0] instanceof RegExp)) {
    throw new Error(loggingKey +
        'args.pathSecurity tuples expect the first argument to be a RegExp.');
  } else if (!Array.isArray(tuple[1])) {
    throw new Error(loggingKey +
        'args.pathSecurity tuples expect the second argument to be a security Array.');
  }
}

function byDefault(param) {
  return param && 'default' in param;
}

function byDirectory(el) {
  return isDir.sync(el);
}

function byMethods(name) {
  // not handling $ref at this time.  Please open an issue if you need this.
  return name in METHOD_ALIASES;
}

function byProperty(property, value) {
  return function(obj) {
    return obj && property in obj && obj[property] === value;
  };
}

function byRoute(a, b) {
  return a.route.localeCompare(b.route);
}

function byString(el) {
  return typeof el === 'string';
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function createAssignApiDocMiddleware(apiDoc, operationDoc) {
  return function(req, res, next) {
    req.apiDoc = apiDoc;
    req.operationDoc = operationDoc;
    next();
  };
}

function getAdditionalMiddleware() {
  var additionalMiddleware = [];
  var index = arguments.length - 1;

  while (index > 0) {
    --index;
    var currentDoc = arguments[index + 1];
    var parentDoc = arguments[index];

    if (currentDoc && currentDoc[INHERIT_ADDITIONAL_MIDDLEWARE_PROPERTY] === false) {
      break;
    } else {
      [].unshift.apply(additionalMiddleware, getDocMiddleware(parentDoc));
    }
  }

  return additionalMiddleware.filter(function(middleware) {
    if (typeof middleware === 'function') {
      return true;
    } else {
      console.warn(loggingKey, 'Ignoring ' + middleware + ' as middleware in ' +
          ADDITIONAL_MIDDLEWARE_PROPERTY + ' array.');
      return false;
    }
  });

  function getDocMiddleware(doc) {
    if (doc && Array.isArray(doc[ADDITIONAL_MIDDLEWARE_PROPERTY])) {
      return doc[ADDITIONAL_MIDDLEWARE_PROPERTY];
    }
  }
}

function getMethodDoc(operationHandler) {
  return operationHandler.apiDoc || (Array.isArray(operationHandler) ?
    operationHandler.slice(-1)[0].apiDoc :
    null);
}

function getSecurityDefinitionByPath(openapiPath, pathSecurity) {
  for (var i = pathSecurity.length; i--;) {
    var tuple = pathSecurity[i];
    if (tuple[0].test(openapiPath)) {
      return tuple[1];
    }
  }
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

function resolveParameterRefs(parameters, definitions) {
  return parameters.map(function(parameter) {
    if (typeof parameter.$ref === 'string') {
      var match = PARAMETER_REF_REGEX.exec(parameter.$ref);
      var definition = match && definitions[match[1]];

      if (!definition) {
        throw new Error(
            'Invalid parameter $ref or definition not found in apiDoc.parameters: ' +
            parameter.$ref);
      }

      return definition;
    } else {
      return parameter;
    }
  });
}

function resolveResponseRefs(responses, apiDoc, pathToModule) {
  return Object.keys(responses).reduce(function(resolvedResponses, responseCode) {
    var response = responses[responseCode];

    if (typeof response.$ref === 'string') {
      var match = RESPONSE_REF_REGEX.exec(response.$ref);
      var definition = match && (apiDoc[match[1]] || {})[match[2]];

      if (!definition) {
        throw new Error(
            'Invalid response $ref or definition not found in apiDoc.responses: ' +
            response.$ref);
      }

      if (match[1] === 'definitions') {
        console.warn('Using "$ref: \'#/definitions/...\'" for responses has been deprecated.');
        console.warn('Please switch to "$ref: \'#/responses/...\'" in ' + pathToModule + '.');
        console.warn('Future versions of express-openapi will no longer support this.');
      }

      resolvedResponses[responseCode] = definition;
    } else {
      resolvedResponses[responseCode] = response;
    }

    return resolvedResponses;
  }, {});
}

function sortApiDocTags(apiDoc) {
  if (apiDoc && Array.isArray(apiDoc.tags)) {
    apiDoc.tags.sort(function(a, b) {
      return a.name > b.name;
    });
  }
}

function toAbsolutePath(part) {
  return path.resolve(process.cwd(), part);
}

function toExpressParams(part) {
  return part.replace(/^\{([^\}]+)\}$/, ':$1');
}

function withNoDuplicates(arr) {
  var parameters = [];
  var seenParams = {};
  var index = arr.length;

  while (index > 0) {
    --index;
    var item = arr[index];
    var key = [item.name, item.location].join(';////|||||\\\\;');

    if (key in seenParams) {
      continue;
    }

    seenParams[key] = true;
    // unshifting to preserve ordering.
    parameters.unshift(item);
  }

  return parameters;
}

//http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
var _DI_STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var _DI_ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(_DI_STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(_DI_ARGUMENT_NAMES);
  return result||[];
}

function dependencyInjection(dependencies, handler) {

  if (typeof(dependencies) === "object") {
    return handler.apply(null, getParamNames(handler).map(function (param) {
      var dep = dependencies[param];
      if(!dep){
        throw new Error('express-openapi: a route function signature contains a parameter that was not found in args.dependencies: ' + param);
      }
      return dep;
    }));
  }

  throw new Error('express-openapi: args.dependencies must be an object when given');

}
