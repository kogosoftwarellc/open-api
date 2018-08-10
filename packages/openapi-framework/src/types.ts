import { OpenAPIV2, OpenAPIV3, IJsonSchema } from 'openapi-types';

export {
  OpenapiFrameworkOptions,
  OpenAPIErrorTransformer
};

// TODO move this to openapi-request-validator
type OpenAPIErrorTransformer = ({}, {}) => Object

type PathSecurityTuple = [RegExp, SecurityRequirement[]]

interface SecurityRequirement {
  [name: string]: SecurityScope[]
}

type SecurityScope = string

interface SecurityHandlers {
  [name: string]: SecurityHandler
}

interface SecurityHandler {
  // TODO: Add OpenAPIV3 SecuritySchemeObject equivalent in openapi-types
  (req: Request, scopes: SecurityScope[], definition: OpenAPIV2.SecuritySchemeObject, cb: SecurityHandlerCallback): void;
}

interface SecurityHandlerCallback {
  (error: SecurityHandlerError, result: boolean): void;
}

interface SecurityHandlerError {
  status?: number;
  challenge?: string;
  message?: any;
}

export interface IOpenapiFramework {
  featureType: string
  loggingPrefix: string
  name: string
}

interface OpenapiFrameworkOptions {
  apiDoc: OpenAPIV2.Document | OpenAPIV3.Document | string
  customFormats?: {string: (any) => boolean}
  dependencies?: {[service:string]: any}
  errorTransformer?: OpenAPIErrorTransformer
  externalSchemas?: {string: IJsonSchema}
  featureType: string
  name: string
  pathSecurity?: PathSecurityTuple[]
  paths: string | Object[]
  pathsIgnore?: RegExp
  routesGlob?: string;
  routesIndexFileRegExp?: RegExp;
  securityHandlers?: SecurityHandlers // TODO define the handlers more here
  validateApiDoc?: boolean
}

export interface OpenapiFrameworkAPIContext {
  basePath: string
  // TODO fill this out
  getApiDoc(): any
}

export interface OpenapiFrameworkPathContext {
  basePath: string
  // TODO fill this out
  getApiDoc(): any
  getPathDoc(): any
}

export interface OpenapiFrameworkOperationContext {
  additionalFeatures: Array<any>
  allowsFeatures: boolean
  apiDoc: any
  basePath: string
  consumes: Array<String>
  // TODO define these
  features: {
    coercer?: any
    defaultSetter?: any
    requestValidator?: any
    responseValidator?: any
    securityHandler?: any
  }
  methodName: string
  methodParameters: Array<any>
  operationDoc: any
  operationHandler: any
  path: string
}

// TODO define this better
export interface OpenapiFrameworkVisitor {
  visitApi?(context: OpenapiFrameworkAPIContext): void;
  visitPath?(context: OpenapiFrameworkPathContext): void;
  visitOperation?(context: OpenapiFrameworkOperationContext): void;
}
