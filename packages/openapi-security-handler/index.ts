import { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';

export interface IOpenAPISecurityHandler {
  handle(request: OpenAPI.Request): Promise<void>
}

export interface OpenAPISecurityHandlerArgs {
  loggingKey: string
  operationSecurity: Array<OpenAPIV2.SecurityRequirementObject | OpenAPIV3.SecurityRequirementObject>
  securityDefinitions: OpenAPIV2.SecurityDefinitionsObject
  securityHandlers: SecurityHandlers
}

export interface SecurityHandlers {
  [name: string]: SecurityHandler
}

export type SecurityScope = string

export interface SecurityHandler {
  // TODO: Add OpenAPIV3 SecuritySchemeObject equivalent in openapi-types
  (req: OpenAPI.Request, scopes: SecurityScope[], definition: OpenAPIV2.SecuritySchemeObject): Promise<boolean> | boolean;
}

interface SecuritySet {
  definition: OpenAPIV2.SecuritySchemeObject,
  handler: SecurityHandler,
  scopes: string[]
}

export default class OpenAPISecurityHandler implements IOpenAPISecurityHandler {
  private operationSecurity: Array<OpenAPIV2.SecurityRequirementObject | OpenAPIV3.SecurityRequirementObject>;
  private securitySets: Array<Array<SecuritySet>>;

  constructor(args: OpenAPISecurityHandlerArgs) {
    const loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
    if (!args) {
      throw new Error(loggingKey + 'missing args argument');
    }

    const securityDefinitions = args.securityDefinitions;
    const securityHandlers = args.securityHandlers;
    const operationSecurity = args.operationSecurity;

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
      .map(security => {
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
      this.handle = () => Promise.resolve();
    }
  }

  async handle(request): Promise<void> {
    let lastError;
    let operationSecurity = this.operationSecurity;
    return this.securitySets
      .reduce((promiseChain: Promise<boolean>, currentTask: Array<SecuritySet>) => {
        return promiseChain.then((result: boolean): Promise<boolean> => {
          if (!result) {
            let resultPromises: Array<Promise<boolean> | boolean> = currentTask.map((securitySet: SecuritySet) => {
              return securitySet.handler(request, securitySet.scopes, securitySet.definition);
            });
            return Promise.all(resultPromises).then((results: Array<boolean>) => {
              return results.filter(result => !result).length === 0;
            });
          }
          return Promise.resolve(result);
        });
      }, Promise.resolve(false))
      .then(result => {
        if (!result) {
          return Promise.reject({
            status: 401,
            message: 'No security handlers returned an acceptable response: ' +
                operationSecurity.map(toAuthenticationScheme).join(' OR '),
            errorCode: 'authentication.openapi.security'
          });
        }
      });
  }
}

function toAuthenticationScheme(security) {
  return Object.keys(security).join(' AND ');
}
