var ADDITIONAL_MIDDLEWARE_PROPERTY = 'x-express-openapi-additional-middleware';
var buildDefaultsMiddleware = require('express-openapi-defaults');
var buildCoercionMiddleware = require('express-openapi-coercion');
var fsRoutes = require('fs-routes');
var INHERIT_ADDITIONAL_MIDDLEWARE_PROPERTY = 'x-express-openapi-inherit-additional-middleware';
var isDir = require('is-dir');
var loggingKey = require('./package.json').name + ': ';
var path = require('path');
var buildValidationMiddleware = require('express-openapi-validation');
var buildResponseValidationMiddleware = require('express-openapi-response-validation');
var buildSecurityMiddleware = require('express-openapi-security');
var PARAMETER_REF_REGEX = /^#\/parameters\/(.+)$/;
var RESPONSE_REF_REGEX = /^#\/(definitions|responses)\/(.+)$/;
var validateSchema = require('openapi-schema-validation').validate;
var METHOD_ALIASES = {
  get: 'get',
  put: 'put',
  post: 'post',
  del: 'delete',
  delete: 'delete',
  options: 'options',
  head: 'head',
  patch: 'patch'
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

  if ('externalSchemas' in args && typeof args.externalSchemas !== 'object') {
    throw new Error(loggingKey + 'args.externalSchemas must be a object when given');
  }

  if ('securityHandlers' in args && typeof args.securityHandlers !== 'object') {
    throw new Error(loggingKey + 'args.securityHandlers must be an object when given');
  }

  var app = args.app;
  // Do not make modifications to this.
  var originalApiDoc = args.apiDoc;
  // Make a copy of the apiDoc that we can safely modify.
  var apiDoc = copy(args.apiDoc);
  var docsPath = args.docsPath || '/api-docs';
  var routesDir = path.resolve(process.cwd(), args.routes);
  var basePath = apiDoc.basePath || '';
  var errorTransformer = args.errorTransformer;
  var customFormats = args.customFormats;
  var errorMiddleware = typeof args.errorMiddleware === 'function' &&
      args.errorMiddleware.length === 4 ? args.errorMiddleware : null;
  var parameterDefinitions = apiDoc.parameters || {};
  var externalSchemas = args.externalSchemas || {};
  var securityHandlers = args.securityHandlers;
  var apiSecurity = securityHandlers && apiDoc.security && apiDoc.securityDefinitions ?
      buildSecurityMiddleware(apiDoc.securityDefinitions, securityHandlers,
          apiDoc.security) :
      null;

  fsRoutes(routesDir).forEach(function(result) {
    var pathModule = require(result.path);
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
      // methodHandler may be an array or a function.
      var methodHandler = pathModule[methodName];
      var methodDoc = getMethodDoc(methodHandler);
      var middleware = [].concat(getAdditionalMiddleware(originalApiDoc, originalPathItem,
            pathModule, methodDoc));
      (methodDoc && methodDoc.tags || []).forEach(addOperationTagToApiDoc.bind(null, apiDoc));

      methodName = METHOD_ALIASES[methodName];

      if (methodDoc &&
          allowsMiddleware(apiDoc, pathModule, pathItem, methodDoc)) {// add middleware
        pathItem[methodName] = copy(methodDoc);

        if (methodDoc.responses && allowsResponseValidationMiddleware(apiDoc,
              pathModule, pathItem, methodDoc)) {// add response validation middleware
          // it's invalid for a method doc to not have responses, but the post
          // validation will pick it up, so this is almost always going to be added.
          middleware.unshift(buildResponseValidationMiddleware({
            definitions: apiDoc.definitions,
            externalSchemas: externalSchemas,
            errorTransformer: errorTransformer,
            responses: resolveResponseRefs(methodDoc.responses, apiDoc, result.path),
            customFormats: customFormats
          }));
        }

        var methodParameters = withNoDuplicates(resolveParameterRefs(
          Array.isArray(methodDoc.parameters) ?
          pathParameters.concat(methodDoc.parameters) :
          pathParameters, parameterDefinitions));

        if (methodParameters.length) {// defaults, coercion, and parameter validation middleware
          if (allowsValidationMiddleware(apiDoc, pathModule, pathItem, methodDoc)) {
            var validationMiddleware = buildValidationMiddleware({
              errorTransformer: errorTransformer,
              parameters: methodParameters,
              schemas: apiDoc.definitions,
              externalSchemas: externalSchemas,
              customFormats: customFormats
            });
            middleware.unshift(validationMiddleware);
          }

          if (allowsCoercionMiddleware(apiDoc, pathModule, pathItem, methodDoc)) {
            var coercionMiddleware = buildCoercionMiddleware({parameters: methodParameters});
            middleware.unshift(coercionMiddleware);
          }

          // no point in default middleware if we don't have any parameters with defaults.
          if (methodParameters.filter(byDefault).length &&
              allowsDefaultsMiddleware(apiDoc, pathModule, pathItem, methodDoc)) {
            var defaultsMiddleware = buildDefaultsMiddleware({parameters: methodParameters});
            middleware.unshift(defaultsMiddleware);
          }
        }
      }

      var securityMiddleware;
      if (securityHandlers && methodDoc.security && apiDoc.securityDefinitions) {
        securityMiddleware = buildSecurityMiddleware(apiDoc.securityDefinitions,
            securityHandlers, methodDoc.security);
      } else if (apiSecurity) {
        securityMiddleware = apiSecurity;
      }

      if (securityMiddleware) {
        middleware.push(securityMiddleware);
      }

      middleware.push(methodHandler);

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
      res.status(200).json(apiDoc);
    });
  }

  if (errorMiddleware) {
    app.use(basePath, errorMiddleware);
  }

  function setBasePath() {
    // none-express app may not have mountpath
    apiDoc.basePath = (app.mountpath||'').replace(/\/$/, '') + basePath;
  }

  app.on('mount', setBasePath);
  setBasePath();

  var initializedApi = {
    apiDoc: apiDoc
  };

  return initializedApi;
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

function byDefault(param) {
  return param && 'default' in param;
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

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
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

function getMethodDoc(methodHandler) {
  return methodHandler.apiDoc || (Array.isArray(methodHandler) ?
    methodHandler.slice(-1)[0].apiDoc :
    null);
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
    // unshifting to preserve ordering.  I don't believe it matters, but good to be
    // consistent.
    parameters.unshift(item);
  }

  return parameters;
}
