import { OpenAPI, OpenAPIV2, OpenAPIV3, IJsonSchema } from 'openapi-types';
import { IOpenAPIDefaultSetter } from 'openapi-default-setter';
import { IOpenAPIRequestCoercer } from 'openapi-request-coercer';
import { IOpenAPIRequestValidator } from 'openapi-request-validator';
import { IOpenAPIResponseValidator } from 'openapi-response-validator';
import { IOpenAPISecurityHandler, SecurityHandlers } from 'openapi-security-handler';

export {
  OpenAPIFrameworkArgs,
  OpenAPIFrameworkConstructorArgs,
  OpenAPIErrorTransformer
};

// TODO move this to openapi-request-validator
type OpenAPIErrorTransformer = ({}, {}) => Object

type PathSecurityTuple = [RegExp, SecurityRequirement[]]

interface SecurityRequirement {
  [name: string]: SecurityScope[]
}

type SecurityScope = string

interface SecurityHandlerCallback {
  (error: SecurityHandlerError, result: boolean): void;
}

interface SecurityHandlerError {
  status?: number;
  challenge?: string;
  message?: any;
}

export interface OpenAPIFrameworkPathObject {
  path?: string
  module?: any
}

export interface IOpenAPIFramework {
  featureType: string
  loggingPrefix: string
  name: string
}

interface OpenAPIFrameworkConstructorArgs extends OpenAPIFrameworkArgs {
  featureType: string
  name: string
}

interface OpenAPIFrameworkArgs {
  apiDoc: OpenAPIV2.Document | OpenAPIV3.Document | string
  customFormats?: {string: (any) => boolean}
  dependencies?: {[service:string]: any}
  enableObjectCoercion?: boolean
  errorTransformer?: OpenAPIErrorTransformer
  externalSchemas?: {string: IJsonSchema}
  pathSecurity?: PathSecurityTuple[]
  paths: string | Array<OpenAPIFrameworkPathObject>
  pathsIgnore?: RegExp
  routesGlob?: string;
  routesIndexFileRegExp?: RegExp;
  securityHandlers?: SecurityHandlers;// TODO define the handlers more here
  validateApiDoc?: boolean
}

export interface OpenAPIFrameworkAPIContext {
  basePath: string
  // TODO fill this out
  getApiDoc(): any
}

export interface OpenAPIFrameworkPathContext {
  basePath: string
  // TODO fill this out
  getApiDoc(): any
  getPathDoc(): any
}

export interface OpenAPIFrameworkOperationContext {
  additionalFeatures: Array<any>
  allowsFeatures: boolean
  apiDoc: any
  basePath: string
  consumes: Array<String>
  features: {
    coercer?: IOpenAPIRequestCoercer
    defaultSetter?: IOpenAPIDefaultSetter
    requestValidator?: IOpenAPIRequestValidator
    responseValidator?: IOpenAPIResponseValidator
    securityHandler?: IOpenAPISecurityHandler
  }
  methodName: string
  methodParameters: Array<any>
  operationDoc: any
  operationHandler: any
  path: string
}

export interface OpenAPIFrameworkVisitor {
  visitApi?(context: OpenAPIFrameworkAPIContext): void;
  visitPath?(context: OpenAPIFrameworkPathContext): void;
  visitOperation?(context: OpenAPIFrameworkOperationContext): void;
}
