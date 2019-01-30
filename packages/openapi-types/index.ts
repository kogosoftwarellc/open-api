/* tslint:disable:no-namespace no-empty-interface */
export namespace OpenAPI {
  export type Document = OpenAPIV2.Document | OpenAPIV3.Document;
  export type Operation = OpenAPIV2.OperationObject | OpenAPIV3.OperationObject;
  export type Parameter =
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ParameterObject
    | OpenAPIV2.ReferenceObject
    | OpenAPIV2.Parameter;
  export type Parameters =
    | Array<OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject>
    | Array<OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter>;

  export interface Request {
    body?: any;
    headers?: object;
    params?: object;
    query?: object;
  }
}

export namespace OpenAPIV3 {
  export interface Document {
    openapi: string;
    info: InfoObject;
    servers?: ServerObject[];
    paths: { [path: string]: PathItemObject };
    components?: ComponentsObject;
    security?: SecurityRequirementObject[];
    tags?: TagObject[];
    externalDocs?: ExternalDocumentationObject;
  }

  export interface InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
  }

  export interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
  }

  export interface LicenseObject {
    name: string;
    url?: string;
  }

  export interface ServerObject {
    url: string;
    description?: string;
    variables?: { [variable: string]: ServerVariableObject };
  }

  export interface ServerVariableObject {
    enum?: string[];
    default: string;
    description?: string;
  }

  export interface PathObject {
    [pattern: string]: PathItemObject;
  }

  export interface PathItemObject {
    $ref?: string;
    summary?: string;
    description?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    trace?: OperationObject;
    servers?: ServerObject[];
    parameters?: Array<ReferenceObject | ParameterObject>;
  }

  export interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: Array<ReferenceObject | ParameterObject>;
    requestBody?: ReferenceObject | RequestBodyObject;
    responses?: ResponsesObject;
    callbacks?: { [callback: string]: ReferenceObject | CallbackObject };
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
  }

  export interface ExternalDocumentationObject {
    description?: string;
    url: string;
  }

  export interface ParameterObject extends ParameterBaseObject {
    name: string;
    in: string;
  }

  export interface HeaderObject extends ParameterBaseObject {}

  interface ParameterBaseObject {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
    schema?: ReferenceObject | SchemaObject;
    example?: any;
    examples?: { [media: string]: ReferenceObject | ExampleObject };
    content?: { [media: string]: MediaTypeObject };
  }
  export type NonArraySchemaObjectType =
    | 'null'
    | 'boolean'
    | 'object'
    | 'number'
    | 'string'
    | 'integer';
  export type ArraySchemaObjectType = 'array';
  export type SchemaObject = ArraySchemaObject | NonArraySchemaObject;

  interface ArraySchemaObject extends BaseSchemaObject {
    type: ArraySchemaObjectType;
    items: ReferenceObject | SchemaObject;
  }

  interface NonArraySchemaObject extends BaseSchemaObject {
    type: NonArraySchemaObjectType;
  }

  interface BaseSchemaObject {
    // JSON schema allowed properties, adjusted for OpenAPI
    title?: string;
    description?: string;
    format?: string;
    default?: any;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    additionalProperties?: boolean | ReferenceObject | SchemaObject;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    enum?: any[];
    properties?: {
      [name: string]: ReferenceObject | SchemaObject;
    };
    allOf?: Array<ReferenceObject | SchemaObject>;
    oneOf?: Array<ReferenceObject | SchemaObject>;
    anyOf?: Array<ReferenceObject | SchemaObject>;
    not?: ReferenceObject | SchemaObject;

    // OpenAPI-specific properties
    nullable?: boolean;
    discriminator?: DiscriminatorObject;
    readOnly?: boolean;
    writeOnly?: boolean;
    xml?: XMLObject;
    externalDocs?: ExternalDocumentationObject;
    example?: any;
    deprecated?: boolean;
  }

  export interface DiscriminatorObject {
    propertyName: string;
    mapping?: { [value: string]: string };
  }

  export interface XMLObject {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
  }

  export interface ReferenceObject {
    $ref: string;
  }

  export interface ExampleObject {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
  }

  export interface MediaTypeObject {
    schema?: ReferenceObject | SchemaObject;
    example?: any;
    examples?: { [media: string]: ReferenceObject | ExampleObject };
    encoding?: { [media: string]: EncodingObject };
  }

  export interface EncodingObject {
    contentType?: string;
    headers?: { [header: string]: ReferenceObject | HeaderObject };
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
  }

  export interface RequestBodyObject {
    description?: string;
    content: { [media: string]: MediaTypeObject };
    required?: boolean;
  }

  export interface ResponsesObject {
    [code: string]: ReferenceObject | ResponseObject;
  }

  export interface ResponseObject {
    description: string;
    headers?: { [header: string]: ReferenceObject | HeaderObject };
    content?: { [media: string]: MediaTypeObject };
    links?: { [link: string]: ReferenceObject | LinkObject };
  }

  export interface LinkObject {
    operationRef?: string;
    operationId?: string;
    parameters?: { [parameter: string]: any };
    requestBody?: any;
    description?: string;
    server?: ServerObject;
  }

  export interface CallbackObject {
    [url: string]: PathItemObject;
  }

  export interface SecurityRequirementObject {
    [name: string]: string[];
  }

  export interface ComponentsObject {
    schemas?: { [key: string]: ReferenceObject | SchemaObject };
    responses?: { [key: string]: ReferenceObject | ResponseObject };
    parameters?: { [key: string]: ReferenceObject | ParameterObject };
    examples?: { [key: string]: ReferenceObject | ExampleObject };
    requestBodies?: { [key: string]: ReferenceObject | RequestBodyObject };
    headers?: { [key: string]: ReferenceObject | HeaderObject };
    securitySchemes?: { [key: string]: ReferenceObject | SecuritySchemeObject };
    links?: { [key: string]: ReferenceObject | LinkObject };
    callbacks?: { [key: string]: ReferenceObject | CallbackObject };
  }

  export type SecuritySchemeObject =
    | HttpSecurityScheme
    | ApiKeySecurityScheme
    | OAuth2SecurityScheme
    | OpenIdSecurityScheme;

  export interface HttpSecurityScheme {
    type: 'http';
    description?: string;
    scheme: string;
    bearerFormat?: string;
  }

  export interface ApiKeySecurityScheme {
    type: 'apiKey';
    description?: string;
    name: string;
    in: string;
  }

  export interface OAuth2SecurityScheme {
    type: 'oauth2';
    flows: {
      implicit?: {
        authorizationUrl: string;
        refreshUrl?: string;
        scopes: { [scope: string]: string };
      };
      password?: {
        tokenUrl: string;
        refreshUrl?: string;
        scopes: { [scope: string]: string };
      };
      clientCredentials?: {
        tokenUrl: string;
        refreshUrl?: string;
        scopes: { [scope: string]: string };
      };
      authorizationCode?: {
        authorizationUrl: string;
        tokenUrl: string;
        refreshUrl?: string;
        scopes: { [scope: string]: string };
      };
    };
  }

  export interface OpenIdSecurityScheme {
    type: 'openIdConnect';
    description?: string;
    openIdConnectUrl: string;
  }

  export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
  }
}

export namespace OpenAPIV2 {
  export interface Document {
    basePath?: string;
    consumes?: MimeTypes;
    definitions?: DefinitionsObject;
    externalDocs?: ExternalDocumentationObject;
    host?: string;
    info: InfoObject;
    parameters?: ParametersDefinitionsObject;
    paths: PathsObject;
    produces?: MimeTypes;
    responses?: ResponsesDefinitionsObject;
    schemes?: string[];
    security?: SecurityRequirementObject[];
    securityDefinitions?: SecurityDefinitionsObject;
    swagger: string;
    tags?: TagObject[];
  }

  export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
  }

  interface SecuritySchemeObjectBase {
    type: 'basic' | 'apiKey' | 'oauth2';
    description?: string;
  }

  interface SecuritySchemeBasic extends SecuritySchemeObjectBase {
    type: 'basic';
  }

  interface SecuritySchemeApiKey extends SecuritySchemeObjectBase {
    type: 'apiKey';
    name: string;
    in: string;
  }

  type SecuritySchemeOauth2 =
    | SecuritySchemeOauth2Implicit
    | SecuritySchemeOauth2AccessCode
    | SecuritySchemeOauth2Password
    | SecuritySchemeOauth2Application;

  export interface ScopesObject {
    [index: string]: any;
  }

  interface SecuritySchemeOauth2Base extends SecuritySchemeObjectBase {
    flow: 'implicit' | 'password' | 'application' | 'accessCode';
    scopes: ScopesObject;
  }

  interface SecuritySchemeOauth2Implicit extends SecuritySchemeOauth2Base {
    flow: 'implicit';
    authorizationUrl: string;
  }

  interface SecuritySchemeOauth2AccessCode extends SecuritySchemeOauth2Base {
    flow: 'accessCode';
    authorizationUrl: string;
    tokenUrl: string;
  }

  interface SecuritySchemeOauth2Password extends SecuritySchemeOauth2Base {
    flow: 'password';
    tokenUrl: string;
  }

  interface SecuritySchemeOauth2Application extends SecuritySchemeOauth2Base {
    flow: 'application';
    tokenUrl: string;
  }

  export type SecuritySchemeObject =
    | SecuritySchemeBasic
    | SecuritySchemeApiKey
    | SecuritySchemeOauth2;

  export interface SecurityDefinitionsObject {
    [index: string]: SecuritySchemeObject;
  }

  export interface SecurityRequirementObject {
    [index: string]: string[];
  }

  export interface ReferenceObject {
    $ref: string;
  }

  type Response = ResponseObject | ReferenceObject;

  export interface ResponsesDefinitionsObject {
    [index: string]: ResponseObject;
  }

  type Schema = SchemaObject | ReferenceObject;

  export interface ResponseObject {
    description: string;
    schema?: Schema;
    headers?: HeadersObject;
    examples?: ExampleObject;
  }

  export interface HeadersObject {
    [index: string]: HeaderObject;
  }

  export interface HeaderObject extends ItemsObject {}

  export interface ExampleObject {
    [index: string]: any;
  }

  export interface ResponseObject {
    description: string;
    schema?: Schema;
    headers?: HeadersObject;
    examples?: ExampleObject;
  }

  export interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    consumes?: MimeTypes;
    produces?: MimeTypes;
    parameters?: Parameters;
    responses: ResponsesObject;
    schemes?: string[];
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    [index: string]: any;
  }

  export interface ResponsesObject {
    [index: string]: Response | any;
    default: Response;
  }

  export type Parameters = Array<ReferenceObject | Parameter>;

  export type Parameter = InBodyParameterObject | GeneralParameterObject;

  export interface InBodyParameterObject extends ParameterObject {
    schema: Schema;
  }

  export interface GeneralParameterObject extends ParameterObject, ItemsObject {
    allowEmptyValue?: boolean;
  }

  export interface PathItemObject {
    $ref?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    del?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    parameters?: Parameters;
  }

  export interface PathsObject {
    [index: string]: PathItemObject | any;
  }

  export interface ParametersDefinitionsObject {
    [index: string]: ParameterObject;
  }

  interface ParameterObject {
    name: string;
    in: string;
    description?: string;
    required?: boolean;
    [index: string]: any;
  }

  export type MimeTypes = string[];

  export interface DefinitionsObject {
    [index: string]: SchemaObject;
  }

  export interface SchemaObject extends IJsonSchema {
    [index: string]: any;
    discriminator?: string;
    readOnly?: boolean;
    xml?: XMLObject;
    externalDocs?: ExternalDocumentationObject;
    example?: any;
    default?: any;
    items?: ItemsObject;
    properties?: {
      [name: string]: SchemaObject;
    };
  }

  export interface ExternalDocumentationObject {
    [index: string]: any;
    description?: string;
    url: string;
  }

  export interface ItemsObject {
    type: string;
    format?: string;
    items?: ItemsObject;
    collectionFormat?: string;
    default?: any;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    enum?: any[];
    multipleOf?: number;
    $ref?: string;
  }

  export interface XMLObject {
    [index: string]: any;
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
  }

  export interface InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
  }

  export interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
  }

  export interface LicenseObject {
    name: string;
    url?: string;
  }
}

export interface IJsonSchema {
  id?: string;
  $schema?: string;
  title?: string;
  description?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: boolean | IJsonSchema;
  items?: IJsonSchema | IJsonSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | IJsonSchema;
  definitions?: {
    [name: string]: IJsonSchema;
  };
  properties?: {
    [name: string]: IJsonSchema;
  };
  patternProperties?: {
    [name: string]: IJsonSchema;
  };
  dependencies?: {
    [name: string]: IJsonSchema | string[];
  };
  enum?: any[];
  type?: string | string[];
  allOf?: IJsonSchema[];
  anyOf?: IJsonSchema[];
  oneOf?: IJsonSchema[];
  not?: IJsonSchema;
}
