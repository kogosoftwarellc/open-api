import { OpenAPI, OpenAPIV2, IJsonSchema } from 'openapi-types';
import * as express from 'express';

export declare function initialize(args:Args):InitializedApi;

export interface InitializedApi {
    apiDoc: OpenAPI.Document
}

export interface Args {
    apiDoc: OpenAPI.Document | string
    app: express.Application
    routes?: string | string[]
    paths: string | string[] | { path: string, module: any }[]
    pathsIgnore?: RegExp
    routesGlob?: string;
    routesIndexFileRegExp?: RegExp;
    docsPath?: string
    errorMiddleware?: express.ErrorRequestHandler,
    errorTransformer?(openapiError: OpenapiError, jsonschemaError: JsonschemaError): any
    exposeApiDocs?: boolean
    promiseMode?: boolean
    validateApiDoc?: boolean
    consumesMiddleware?: {[mimeType: string]: express.RequestHandler}
    customFormats?: CustomFormats
    externalSchemas?: {[url:string]: any}
    pathSecurity?: PathSecurityTuple[]
    securityHandlers?: SecurityHandlers
    securityFilter?: express.RequestHandler
    dependencies?: {[service:string]: any}
}

export interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any
}

export interface Request extends express.Request {
    get(name: string): any
    header(name: string): any
    headers: { [key: string]: any }
    apiDoc: OpenAPI.Document;
    // TODO: Add OpenAPIV3 OperationObject equivalent in openapi-types
    operationDoc: OpenAPIV2.OperationObject;
}
export type NextFunction = express.NextFunction;
export interface Response extends express.Response {
    validateResponse(status: number, resource: any): {status: number, message: string, errors: any}
}

export interface OperationFunction extends RequestHandler {
    // TODO: Add OpenAPIV3 OperationObject equivalent in openapi-types
    apiDoc?: OpenAPIV2.OperationObject;
}

export interface OperationHandlerArray {
    // TODO: Add OpenAPIV3 OperationObject equivalent in openapi-types
    apiDoc?: OpenAPIV2.OperationObject;
    [index: number]: OperationFunction;
}

export type Operation = OperationFunction | OperationHandlerArray;

export interface PathModule {
    delete?: Operation;
    del?: Operation;
    get?: Operation;
    head?: Operation;
    options?: Operation;
    // TODO: Add OpenAPIV3 Parameters equivalent in openapi-types
    parameters?: OpenAPIV2.Parameters;
    patch?: Operation;
    post?: Operation;
    put?: Operation;
}

export interface OpenapiError {
    errorCode: string
    location: string
    message: string
    path: string
}

export interface CustomFormats {
    [index: string]: CustomFormatValidator
}

// Following 2 interfaces are part of jsonschema package.
interface JsonschemaError {
    property: string
    message: string
    schema: string|IJsonSchema
    instance: any
    name: string
    argument: any
    stack: string
    toString(): string
}

interface CustomFormatValidator {
    (input: any): boolean
}

export type PathSecurityTuple = [RegExp, SecurityRequirement]

export interface SecurityRequirement {
    [name: string]: SecurityScope[]
}

type SecurityScope = string

export interface SecurityHandlers {
    [name: string]: SecurityHandler
}

export interface SecurityHandler {
    // TODO: Add OpenAPIV3 SecuritySchemeObject equivalent in openapi-types
    (req: Request, scopes: SecurityScope[], definition: OpenAPIV2.SecuritySchemeObject, cb: SecurityHandlerCallback): void;
}

export interface SecurityHandlerCallback {
    (error: SecurityHandlerError | null, result: boolean): void;
}

export interface SecurityHandlerError {
    status?: number;
    challenge?: string;
    message?: any;
}
