import { Context, Middleware } from 'koa';
import OpenAPIFramework, {
  BasePath,
  OpenAPIFrameworkAPIContext,
  OpenAPIFrameworkArgs,
  OpenAPIFrameworkConstructorArgs,
  OpenAPIFrameworkOperationContext,
  OpenAPIFrameworkPathContext,
} from 'openapi-framework';

const loggingPrefix = 'koa-openapi';

export interface KoaRouter {
  delete: (...args) => any;
  get: (...args) => any;
  post: (...args) => any;
  put: (...args) => any;
  use: (...args) => any;
}

export interface KoaOpenAPIInitializeArgs extends OpenAPIFrameworkArgs {
  consumesMiddleware?: { [mimeType: string]: Middleware };
  docsPath?: string;
  errorMiddleware?: Middleware;
  exposeApiDocs?: boolean;
  router: KoaRouter;
  securityFilter?: Middleware;
}

export async function initialize(
  args: KoaOpenAPIInitializeArgs
): Promise<OpenAPIFramework> {
  if (!args) {
    throw new Error(`${loggingPrefix}: args must be an object`);
  }

  if (!args.router) {
    throw new Error(`${loggingPrefix}: args.router must be a koa router`);
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

  const router = args.router;
  // Do not make modifications to this.
  const docsPath = args.docsPath || '/api-docs';
  const consumesMiddleware = args.consumesMiddleware;
  const errorMiddleware =
    typeof args.errorMiddleware === 'function' &&
    args.errorMiddleware.length === 4
      ? args.errorMiddleware
      : null;
  const securityFilter =
    args.securityFilter ||
    function defaultSecurityFilter(ctx, next) {
      ctx.status = 200;
      ctx.body = ctx.state.apiDoc;
    };

  const frameworkArgs: OpenAPIFrameworkConstructorArgs = {
    apiDoc: args.apiDoc,
    featureType: 'middleware',
    name: loggingPrefix,
    paths: args.paths,
    ...(args as OpenAPIFrameworkArgs),
  };

  const framework = new OpenAPIFramework(frameworkArgs);

  await framework.initialize({
    visitApi(apiCtx: OpenAPIFrameworkAPIContext) {
      const basePaths = apiCtx.basePaths.map(toKoaBasePath);
      for (const basePath of basePaths) {
        if (exposeApiDocs) {
          // Swagger UI support
          router.get(basePath + docsPath, (ctx: Context, next) => {
            ctx.state.apiDoc = apiCtx.getApiDoc();
            if (ctx.state.apiDoc.swagger) {
              ctx.state.apiDoc.host = ctx.headers.host;
              ctx.state.apiDoc.basePath =
                basePath.length === 0 ? '/' : basePath;
            }
            securityFilter(ctx, next);
          });
        }

        if (errorMiddleware) {
          router.use(basePath, errorMiddleware);
        }
      }
    },

    visitOperation(operationCtx: OpenAPIFrameworkOperationContext) {
      const apiDoc = operationCtx.apiDoc;
      const methodName = operationCtx.methodName;
      const operationDoc = operationCtx.operationDoc;
      const operationHandler = operationCtx.operationHandler;
      let middleware = [].concat(operationCtx.additionalFeatures);

      if (operationDoc && operationCtx.allowsFeatures) {
        if (operationCtx.features.requestValidator) {
          middleware.unshift(function requestValidatorMiddleware(ctx: Context) {
            const errors = operationCtx.features.requestValidator.validateRequest(
              toOpenAPIRequest(ctx)
            );
            if (errors) {
              ctx.throw(errors.status, errors);
            }
          });
        }

        if (operationCtx.features.responseValidator) {
          // add response validation middleware
          // it's invalid for a method doc to not have responses, but the post
          // validation will pick it up, so this is almost always going to be added.
          middleware.unshift(function responseValidatorMiddleware(
            ctx: Context
          ) {
            ctx.state.validateResponse = (statusCode, response) => {
              return operationCtx.features.responseValidator.validateResponse(
                statusCode,
                response
              );
            };
          });
        }

        if (operationCtx.features.coercer) {
          middleware.unshift(function coercerMiddleware(ctx: Context) {
            operationCtx.features.coercer.coerce(toOpenAPIRequest(ctx));
          });
        }

        if (operationCtx.features.defaultSetter) {
          middleware.unshift(function defaultMiddleware(ctx: Context) {
            operationCtx.features.defaultSetter.handle(toOpenAPIRequest(ctx));
          });
        }

        if (operationCtx.features.securityHandler) {
          middleware.unshift(
            createSecurityMiddleware(operationCtx.features.securityHandler)
          );
        }

        if (consumesMiddleware && operationCtx.consumes) {
          addConsumesMiddleware(
            middleware,
            consumesMiddleware,
            operationCtx.consumes
          );
        }

        middleware.unshift(createAssignApiDocMiddleware(apiDoc, operationDoc));
      }

      middleware = middleware.concat(operationHandler);

      const basePaths = operationCtx.basePaths.map(toKoaBasePath);

      for (const basePath of basePaths) {
        const koaPath =
          basePath +
          '/' +
          operationCtx.path.substring(1).split('/').map(toPathParams).join('/');

        const routeName = operationDoc?.operationId;
        router[methodName](routeName, koaPath, async (ctx, next) => {
          for (const fn of middleware) {
            await fn(ctx, next);
          }
        });
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
  return function assignApiDocMiddleware(ctx: Context) {
    ctx.state.apiDoc = apiDoc;
    ctx.state.operationDoc = operationDoc;
  };
}

function createSecurityMiddleware(handler) {
  return function securityMiddleware(ctx: Context) {
    return handler.handle(ctx, (err, result) => {
      if (err) {
        if (err.challenge) {
          ctx.set('www-authenticate', err.challenge);
        }
        ctx.status = err.status;

        if (typeof err.message === 'string') {
          ctx.body = err.message;
        } else {
          ctx.body = err.message;
        }
      }
    });
  };
}

function toOpenAPIRequest(ctx) {
  return {
    body: ctx.request.body,
    headers: ctx.request.headers,
    params: ctx.params,
    query: ctx.request.query,
  };
}

function toPathParams(part) {
  return part.replace(/\{([^}]+)}/g, ':$1');
}

function toKoaBasePath(basePath: BasePath) {
  return basePath.path;
}
