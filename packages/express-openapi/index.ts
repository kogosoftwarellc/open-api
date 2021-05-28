import { ErrorObject, FormatDefinition, Format } from 'ajv';
import { Application, ErrorRequestHandler, RequestHandler } from 'express';
import OpenAPIFramework, {
  BasePath,
  OpenAPIFrameworkArgs,
  OpenAPIFrameworkConstructorArgs,
  OpenAPIRequestValidatorError,
  OpenAPIResponseValidatorError,
  SecurityHandlers,
} from 'openapi-framework';
import { OpenAPI, OpenAPIV3 } from 'openapi-types';
const CASE_SENSITIVE_PARAM_PROPERTY = 'x-express-openapi-case-sensitive';
const normalizeQueryParamsMiddleware = require('express-normalize-query-params-middleware');
const loggingPrefix = 'express-openapi';

export interface OperationFunction extends RequestHandler {
  apiDoc?: OpenAPI.Operation;
}

export interface OperationHandlerArray {
  apiDoc?: OpenAPI.Operation;
  [index: number]: RequestHandler;
}

export type Operation = OperationFunction | OperationHandlerArray;

export interface ExpressOpenAPIArgs extends OpenAPIFrameworkArgs {
  app: Application;
  consumesMiddleware?: { [mimeType: string]: RequestHandler };
  docsPath?: string;
  errorMiddleware?: ErrorRequestHandler;
  exposeApiDocs?: boolean;
  promiseMode?: boolean;
  securityFilter?: RequestHandler;
}

export function initialize(args: ExpressOpenAPIArgs): OpenAPIFramework {
  if (!args) {
    throw new Error(`${loggingPrefix}: args must be an object`);
  }

  if (!args.app) {
    throw new Error(`${loggingPrefix}: args.app must be an express app`);
  }

  const exposeApiDocs = 'exposeApiDocs' in args ? !!args.exposeApiDocs : true;

  if (args.docsPath && typeof args.docsPath !== 'string') {
    throw new Error(
      `${loggingPrefix}: args.docsPath must be a string when given`
    );
  }

  if ('securityFilter' in args && typeof args.securityFilter !== 'function') {
    throw new Error(
      `${loggingPrefix}: args.securityFilter must be a function when given`
    );
  }

  const app = args.app;
  const docsPath = args.docsPath || '/api-docs';
  const consumesMiddleware = args.consumesMiddleware;
  const errorMiddleware =
    typeof args.errorMiddleware === 'function' &&
    args.errorMiddleware.length === 4
      ? args.errorMiddleware
      : null;
  const promiseMode = !!args.promiseMode;
  const securityFilter = args.securityFilter
    ? args.promiseMode
      ? toPromiseCompatibleMiddleware(args.securityFilter)
      : args.securityFilter
    : function defaultSecurityFilter(req, res, next) {
        res.status(200).json(req.apiDoc);
      };

  const frameworkArgs: OpenAPIFrameworkConstructorArgs = {
    featureType: 'middleware',
    name: loggingPrefix,
    ...(args as OpenAPIFrameworkArgs),
  };

  const framework = new OpenAPIFramework(frameworkArgs);

  framework.initialize({
    visitApi: (ctx) => {
      if (exposeApiDocs || errorMiddleware) {
        const basePaths = [];
        basePaths.push(...ctx.basePaths.map(toExpressBasePath));

        for (const basePath of basePaths) {
          // Swagger UI support
          if (exposeApiDocs) {
            app.get(basePath + docsPath, (req, res, next) => {
              // @ts-ignore
              req.apiDoc = ctx.getApiDoc();
              // @ts-ignore
              if (req.apiDoc.swagger) {
                // @ts-ignore
                req.apiDoc.host = req.headers.host;
                const apiBasePath = req.baseUrl + basePath;
                // @ts-ignore
                req.apiDoc.basePath =
                  apiBasePath.length === 0 ? '/' : apiBasePath;
              }
              securityFilter(req, res, next);
            });
          }

          // register custom error middleware to api's basePath
          if (errorMiddleware) {
            app.use(basePath, errorMiddleware);
          }
        }
      }
    },

    visitOperation: (ctx) => {
      const apiDoc = ctx.apiDoc;
      const methodName = ctx.methodName;
      const operationDoc = ctx.operationDoc;
      const operationHandler = ctx.operationHandler;
      let middleware = [].concat(ctx.additionalFeatures);

      if (operationDoc && ctx.allowsFeatures) {
        if (ctx.features.requestValidator) {
          middleware.unshift(function requestValidatorMiddleware(
            req,
            res,
            next
          ) {
            next(ctx.features.requestValidator.validateRequest(req));
          });
        }

        if (ctx.features.responseValidator) {
          // add response validation middleware
          // it's invalid for a method doc to not have responses, but the post
          // validation will pick it up, so this is almost always going to be added.
          middleware.unshift(function responseValidatorMiddleware(
            req,
            res,
            next
          ) {
            res.validateResponse = (statusCode, response) => {
              return ctx.features.responseValidator.validateResponse(
                statusCode,
                response
              );
            };
            next();
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
          middleware.unshift((req, res, next) => {
            ctx.features.securityHandler.handle(req).then(next).catch(next);
          });
        }

        if (consumesMiddleware && ctx.consumes) {
          addConsumesMiddleware(middleware, consumesMiddleware, ctx.consumes);
        }

        middleware.unshift(createAssignApiDocMiddleware(apiDoc, operationDoc));
      }

      middleware.push(operationHandler);

      optionallyAddQueryNormalizationMiddleware(
        middleware,
        ctx.methodParameters
      );

      if (promiseMode) {
        middleware = [].concat
          .apply([], middleware)
          .map(toPromiseCompatibleMiddleware);
      }

      const basePaths = [];
      basePaths.push(...ctx.basePaths.map(toExpressBasePath));

      for (const basePath of basePaths) {
        const expressPath =
          basePath +
          '/' +
          ctx.path.substring(1).split('/').map(toExpressParams).join('/');
        app[methodName].apply(app, [expressPath].concat(middleware));
      }
    },
  });

  return framework;
}

function addConsumesMiddleware(middleware, consumesMiddleware, consumes) {
  for (let i = consumes.length - 1; i >= 0; --i) {
    const mimeType = consumes[i];
    if (mimeType in consumesMiddleware) {
      const middlewareToAdd = consumesMiddleware[mimeType];
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

function optionallyAddQueryNormalizationMiddleware(
  middleware,
  methodParameters
) {
  if (!methodParameters) {
    return;
  }
  const queryParamsNeedingNormalization = methodParameters
    .filter((param) => {
      return (
        param.in === 'query' && param[CASE_SENSITIVE_PARAM_PROPERTY] === false
      );
    })
    .map((param) => {
      return param.name;
    });
  if (queryParamsNeedingNormalization.length) {
    middleware.unshift(
      normalizeQueryParamsMiddleware(queryParamsNeedingNormalization)
    );
  }
}

function toExpressParams(part) {
  return part.replace(/\{([^}]+)}/g, ':$1');
}

function toPromiseCompatibleMiddleware(fn) {
  if (
    typeof fn === 'function' &&
    fn.name !== 'expressOpenapiPromiseMiddleware'
  ) {
    return function expressOpenapiPromiseMiddleware(req, res, next) {
      const potentialPromise = fn(req, res, next);
      if (potentialPromise && typeof potentialPromise.catch === 'function') {
        potentialPromise.catch(next);
      }
    };
  }
  return fn;
}

function toExpressBasePath(basePath: BasePath) {
  let path: string = basePath.path;
  if (basePath.hasVariables()) {
    path = path.replace(/:(\w+)/g, (substring, p1) => {
      if (basePath.variables[p1].enum) {
        const validationRegex = `((${basePath.variables[p1].enum.join('|')}))`;
        return `:${p1}${validationRegex}`;
      } else {
        return `:${p1}`;
      }
    });
  }
  return path;
}
