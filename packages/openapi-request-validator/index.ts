import Ajv, {
  FormatDefinition,
  Format,
  ValidateFunction,
  ErrorObject,
  KeywordDefinition,
  Options,
} from 'ajv';
import addFormats from 'ajv-formats';
import { convertParametersToJSONSchema } from 'openapi-jsonschema-parameters';
import { IJsonSchema, OpenAPI, OpenAPIV3 } from 'openapi-types';
import { dummyLogger, Logger } from 'ts-log';
const contentTypeParser = require('content-type');
const LOCAL_DEFINITION_REGEX = /^#\/([^\/]+)\/([^\/]+)$/;

export interface IOpenAPIRequestValidator {
  validateRequest(request: OpenAPI.Request);
}

export interface OpenAPIRequestValidatorArgs {
  customFormats?: {
    [formatName: string]: Format | FormatDefinition<string | number>;
  };
  customKeywords?: {
    [keywordName: string]: KeywordDefinition;
  };
  externalSchemas?: {
    [index: string]: IJsonSchema;
  };
  loggingKey?: string;
  logger?: Logger;
  parameters?: OpenAPI.Parameters;
  requestBody?: OpenAPIV3.RequestBodyObject;
  schemas?: IJsonSchema[];
  componentSchemas?: IJsonSchema[];
  errorTransformer?(
    openAPIResponseValidatorValidationError: OpenAPIRequestValidatorError,
    ajvError: ErrorObject
  ): any;
  ajvOptions?: Options;
  enableHeadersLowercase?: boolean;
  additionalQueryProperties?: boolean;
}

export interface OpenAPIRequestValidatorError {
  errorCode: string;
  location?: string;
  message: string;
  path?: string;
  schema?: any;
}

export default class OpenAPIRequestValidator
  implements IOpenAPIRequestValidator {
  private bodySchema: IJsonSchema;
  private errorMapper: (ajvError: ErrorObject) => any;
  private isBodyRequired: boolean;
  private logger: Logger = dummyLogger;
  private loggingKey: string = '';
  private requestBody: OpenAPIV3.RequestBodyObject;
  private requestBodyValidators: RequestBodyValidators = {};
  private validateBody: ValidateFunction;
  private validateFormData: ValidateFunction;
  private validateHeaders: ValidateFunction;
  private validatePath: ValidateFunction;
  private validateQuery: ValidateFunction;
  private enableHeadersLowercase: boolean = true;

  constructor(args: OpenAPIRequestValidatorArgs) {
    const loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
    this.loggingKey = loggingKey;
    if (!args) {
      throw new Error(`${loggingKey}missing args argument`);
    }

    if (args.logger) {
      this.logger = args.logger;
    }

    if (args.hasOwnProperty('enableHeadersLowercase')) {
      this.enableHeadersLowercase = args.enableHeadersLowercase;
    }

    const errorTransformer =
      typeof args.errorTransformer === 'function' && args.errorTransformer;
    const errorMapper = errorTransformer
      ? extendedErrorMapper(errorTransformer)
      : toOpenapiValidationError;
    let bodyValidationSchema;
    let bodySchema;
    let headersSchema;
    let formDataSchema;
    let pathSchema;
    let querySchema;
    let isBodyRequired;

    if (args.parameters !== undefined) {
      if (Array.isArray(args.parameters)) {
        const schemas = convertParametersToJSONSchema(args.parameters);
        bodySchema = schemas.body;
        headersSchema = lowercasedHeaders(
          schemas.headers,
          this.enableHeadersLowercase
        );
        formDataSchema = schemas.formData;
        pathSchema = schemas.path;
        if (schemas.query && args.hasOwnProperty('additionalQueryProperties')) {
          schemas.query.additionalProperties = args.additionalQueryProperties;
        }
        querySchema = schemas.query;
        isBodyRequired =
          // @ts-ignore
          args.parameters.filter(byRequiredBodyParameters).length > 0;
      } else {
        throw new Error(`${loggingKey}args.parameters must be an Array`);
      }
    }

    const v = new Ajv({
      useDefaults: true,
      allErrors: true,
      strict: false,
      // @ts-ignore TODO get Ajv updated to account for logger
      logger: false,
      ...(args.ajvOptions || {}),
    });
    addFormats(v);

    v.removeKeyword('readOnly');
    v.addKeyword({
      keyword: 'readOnly',
      modifying: true,
      compile: (sch) => {
        if (sch) {
          return function validate(data, dataCtx) {
            (validate as any).errors = [
              {
                keyword: 'readOnly',
                instancePath: dataCtx.instancePath,
                message: 'is read-only',
                params: { readOnly: dataCtx.parentDataProperty },
              },
            ];
            return !(sch === true && data !== null);
          };
        }
        return () => true;
      },
    });

    if (args.requestBody) {
      isBodyRequired = args.requestBody.required || false;
    }

    if (args.customFormats) {
      let hasNonFunctionProperty;
      Object.keys(args.customFormats).forEach((format) => {
        const func = args.customFormats[format];
        if (typeof func === 'function') {
          v.addFormat(format, func);
        } else {
          hasNonFunctionProperty = true;
        }
      });
      if (hasNonFunctionProperty) {
        throw new Error(
          `${loggingKey}args.customFormats properties must be functions`
        );
      }
    }

    if (args.customKeywords) {
      for (const [keywordName, keywordDefinition] of Object.entries(
        args.customKeywords
      )) {
        v.addKeyword({
          keyword: keywordName,
          ...keywordDefinition,
        });
      }
    }

    if (bodySchema) {
      bodyValidationSchema = {
        properties: {
          body: bodySchema,
        },
      };
    }
    if (args.componentSchemas) {
      // openapi v3:
      Object.keys(args.componentSchemas).forEach((id) => {
        v.addSchema(args.componentSchemas[id], `#/components/schemas/${id}`);
        this.addSchemaProperties(
          v,
          args.componentSchemas[id],
          `#/components/schemas/${id}`
        );
      });
    } else if (args.schemas) {
      if (Array.isArray(args.schemas)) {
        args.schemas.forEach((schema) => {
          const id = schema.id;

          if (id) {
            const localSchemaPath = LOCAL_DEFINITION_REGEX.exec(id);

            if (localSchemaPath && bodyValidationSchema) {
              let definitions = bodyValidationSchema[localSchemaPath[1]];

              if (!definitions) {
                definitions = bodyValidationSchema[localSchemaPath[1]] = {};
              }

              definitions[localSchemaPath[2]] = schema;
            }

            // backwards compatibility with json-schema-draft-04
            delete schema.id;
            v.addSchema({ $id: id, ...schema }, id);
          } else {
            this.logger.warn(loggingKey, 'igorning schema without id property');
          }
        });
      } else if (bodySchema) {
        bodyValidationSchema.definitions = args.schemas;
        bodyValidationSchema.components = {
          schemas: args.schemas,
        };
      }
    }

    if (args.externalSchemas) {
      Object.keys(args.externalSchemas).forEach((id) => {
        v.addSchema(args.externalSchemas[id], id);
      });
    }

    if (args.requestBody) {
      /* tslint:disable-next-line:forin */
      for (const mediaTypeKey in args.requestBody.content) {
        const bodyContentSchema = args.requestBody.content[mediaTypeKey].schema;
        const copied = JSON.parse(JSON.stringify(bodyContentSchema));
        const resolvedSchema = resolveAndSanitizeRequestBodySchema(copied, v);
        this.requestBodyValidators[mediaTypeKey] = v.compile(
          transformOpenAPIV3Definitions({
            properties: {
              body: resolvedSchema,
            },
            definitions: args.schemas || {},
            components: { schemas: args.schemas },
          })
        );
      }
    }

    this.bodySchema = bodySchema;
    this.errorMapper = errorMapper;
    this.isBodyRequired = isBodyRequired;
    this.requestBody = args.requestBody;
    this.validateBody =
      bodyValidationSchema &&
      v.compile(transformOpenAPIV3Definitions(bodyValidationSchema));
    this.validateFormData =
      formDataSchema &&
      v.compile(transformOpenAPIV3Definitions(formDataSchema));
    this.validateHeaders =
      headersSchema && v.compile(transformOpenAPIV3Definitions(headersSchema));
    this.validatePath =
      pathSchema && v.compile(transformOpenAPIV3Definitions(pathSchema));
    this.validateQuery =
      querySchema && v.compile(transformOpenAPIV3Definitions(querySchema));
  }

  public validateRequest(request) {
    const errors = [];
    let err;
    let schemaError;
    let mediaTypeError;

    if (this.bodySchema) {
      if (request.body) {
        if (!this.validateBody({ body: request.body })) {
          errors.push.apply(
            errors,
            withAddedLocation('body', this.validateBody.errors)
          );
        }
      } else if (this.isBodyRequired) {
        schemaError = {
          location: 'body',
          message:
            'request.body was not present in the request.  Is a body-parser being used?',
          schema: this.bodySchema,
        };
      }
    }

    if (this.requestBody) {
      const contentType = getHeaderValue(request.headers, 'content-type');
      const mediaTypeMatch = getSchemaForMediaType(
        contentType,
        this.requestBody,
        this.logger,
        this.loggingKey
      );
      if (!mediaTypeMatch) {
        if (contentType) {
          mediaTypeError = {
            message: `Unsupported Content-Type ${contentType}`,
          };
        } else if (this.isBodyRequired) {
          errors.push({
            keyword: 'required',
            instancePath: '/body',
            params: {},
            message: 'media type is not specified',
            location: 'body',
          });
        }
      } else {
        const bodySchema = this.requestBody.content[mediaTypeMatch].schema;
        if (request.body) {
          const validateBody = this.requestBodyValidators[mediaTypeMatch];
          if (!validateBody({ body: request.body })) {
            errors.push.apply(
              errors,
              withAddedLocation('body', validateBody.errors)
            );
          }
        } else if (this.isBodyRequired) {
          schemaError = {
            location: 'body',
            message:
              'request.body was not present in the request.  Is a body-parser being used?',
            schema: bodySchema,
          };
        }
      }
    }

    if (this.validateFormData && !schemaError) {
      if (!this.validateFormData(request.body)) {
        errors.push.apply(
          errors,
          withAddedLocation('formData', this.validateFormData.errors)
        );
      }
    }

    if (this.validatePath) {
      if (!this.validatePath(request.params || {})) {
        errors.push.apply(
          errors,
          withAddedLocation('path', this.validatePath.errors)
        );
      }
    }

    if (this.validateHeaders) {
      if (
        !this.validateHeaders(
          lowercaseRequestHeaders(
            request.headers || {},
            this.enableHeadersLowercase
          )
        )
      ) {
        errors.push.apply(
          errors,
          withAddedLocation('headers', this.validateHeaders.errors)
        );
      }
    }

    if (this.validateQuery) {
      if (!this.validateQuery(request.query || {})) {
        errors.push.apply(
          errors,
          withAddedLocation('query', this.validateQuery.errors)
        );
      }
    }

    if (errors.length) {
      err = {
        status: 400,
        errors: errors.map(this.errorMapper),
      };
    } else if (schemaError) {
      err = {
        status: 400,
        errors: [schemaError],
      };
    } else if (mediaTypeError) {
      err = {
        status: 415,
        errors: [mediaTypeError],
      };
    }

    return err;
  }

  public validate(request) {
    console.warn('validate is deprecated, use validateRequest instead.');
    this.validateRequest(request);
  }

  private addSchemaProperties(v, schema, prefix) {
    for (const attr in schema) {
      if (schema.hasOwnProperty(attr)) {
        switch (attr) {
          case 'allOf':
          case 'oneOf':
          case 'anyOf':
            for (let i = 0; i < schema[attr].length; i++) {
              this.addSchemaProperties(
                v,
                schema[attr][i],
                `${prefix}/${attr}/${i}`
              );
            }
            return;
          case 'items':
            this.addSchemaProperties(v, schema[attr], `${prefix}/${attr}`);
            return;
          case 'properties':
            for (const propertyId in schema[attr]) {
              if (schema[attr].hasOwnProperty(propertyId)) {
                const schemaId = `${prefix}/${attr}/${propertyId}`;
                v.addSchema(schema[attr][propertyId], schemaId);
                this.addSchemaProperties(v, schema[attr][propertyId], schemaId);
              }
            }
            return;
        }
      }
    }
  }
}
interface RequestBodyValidators {
  [mediaType: string]: ValidateFunction;
}

function byRequiredBodyParameters<T>(param: T): boolean {
  // @ts-ignore
  return (param.in === 'body' || param.in === 'formData') && param.required;
}

function extendedErrorMapper(mapper) {
  return (ajvError) => mapper(toOpenapiValidationError(ajvError), ajvError);
}

function getSchemaForMediaType(
  contentTypeHeader: string,
  requestBodySpec: OpenAPIV3.RequestBodyObject,
  logger: Logger,
  loggingKey: string
): string {
  if (!contentTypeHeader) {
    return;
  }
  let contentType: string;
  try {
    contentType = contentTypeParser.parse(contentTypeHeader).type;
  } catch (e) {
    logger.warn(
      loggingKey,
      'failed to parse content-type',
      contentTypeHeader,
      e
    );
    if (e instanceof TypeError && e.message === 'invalid media type') {
      return;
    }
    throw e;
  }
  const content = requestBodySpec.content;
  const subTypeWildCardPoints = 2;
  const wildcardMatchPoints = 1;
  let match: string;
  let matchPoints = 0;
  for (const mediaTypeKey in content) {
    if (content.hasOwnProperty(mediaTypeKey)) {
      if (mediaTypeKey.indexOf(contentType) > -1) {
        return mediaTypeKey;
      } else if (mediaTypeKey === '*/*' && wildcardMatchPoints > matchPoints) {
        match = mediaTypeKey;
        matchPoints = wildcardMatchPoints;
      }
      const contentTypeParts = contentType.split('/');
      const mediaTypeKeyParts = mediaTypeKey.split('/');
      if (mediaTypeKeyParts[1] !== '*') {
        continue;
      } else if (
        contentTypeParts[0] === mediaTypeKeyParts[0] &&
        subTypeWildCardPoints > matchPoints
      ) {
        match = mediaTypeKey;
        matchPoints = subTypeWildCardPoints;
      }
    }
  }
  return match;
}

function lowercaseRequestHeaders(headers, enableHeadersLowercase: boolean) {
  if (enableHeadersLowercase) {
    const lowerCasedHeaders = {};

    Object.keys(headers).forEach((header) => {
      lowerCasedHeaders[header.toLowerCase()] = headers[header];
    });

    return lowerCasedHeaders;
  } else {
    return headers;
  }
}

function lowercasedHeaders(headersSchema, enableHeadersLowercase: boolean) {
  if (headersSchema && enableHeadersLowercase) {
    const properties = headersSchema.properties;
    Object.keys(properties).forEach((header) => {
      const property = properties[header];
      delete properties[header];
      properties[header.toLowerCase()] = property;
    });

    if (headersSchema.required && headersSchema.required.length) {
      headersSchema.required = headersSchema.required.map((header) => {
        return header.toLowerCase();
      });
    }
  }

  return headersSchema;
}

function toOpenapiValidationError(error): OpenAPIRequestValidatorError {
  const validationError: OpenAPIRequestValidatorError = {
    path: 'instance' + error.instancePath,
    errorCode: `${error.keyword}.openapi.requestValidation`,
    message: error.message,
    location: error.location,
  };

  if (error.keyword === '$ref') {
    delete validationError.errorCode;
    validationError.schema = { $ref: error.params.ref };
  }

  if (error.params.missingProperty) {
    validationError.path += '/' + error.params.missingProperty;
  }

  validationError.path = validationError.path.replace(
    error.location === 'body' ? /^instance\/body\/?/ : /^instance\/?/,
    ''
  );
  validationError.path = validationError.path.replace(/\//g, '.');

  if (!validationError.path) {
    delete validationError.path;
  }

  return stripBodyInfo(validationError);
}

function stripBodyInfo(error) {
  if (error.location === 'body') {
    if (typeof error.path === 'string') {
      error.path = error.path.replace(/^body\./, '');
    } else {
      // Removing to avoid breaking clients that are expecting strings.
      delete error.path;
    }

    error.message = error.message.replace(/^instance\.body\./, 'instance.');
  }

  return error;
}

function withAddedLocation(location, errors) {
  errors.forEach((error) => {
    error.location = location;
  });

  return errors;
}

function resolveAndSanitizeRequestBodySchema(
  requestBodySchema:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.NonArraySchemaObject
    | OpenAPIV3.ArraySchemaObject,
  v: Ajv
) {
  let resolved;
  let copied;

  if ('properties' in requestBodySchema) {
    const schema = requestBodySchema as OpenAPIV3.NonArraySchemaObject;
    Object.keys(schema.properties).forEach((property) => {
      let prop = schema.properties[property];
      prop = sanitizeReadonlyPropertiesFromRequired(prop);
      if (!prop.hasOwnProperty('$ref') && !prop.hasOwnProperty('items')) {
        prop = resolveAndSanitizeRequestBodySchema(prop, v);
      }
    });
    requestBodySchema = sanitizeReadonlyPropertiesFromRequired(
      requestBodySchema
    );
  } else if ('$ref' in requestBodySchema) {
    resolved = v.getSchema(requestBodySchema.$ref);
    if (resolved && resolved.schema) {
      copied = JSON.parse(JSON.stringify(resolved.schema));
      copied = sanitizeReadonlyPropertiesFromRequired(copied);
      copied = resolveAndSanitizeRequestBodySchema(copied, v);
      requestBodySchema = copied;
    }
  } else if ('items' in requestBodySchema) {
    if ('$ref' in requestBodySchema.items) {
      resolved = v.getSchema(requestBodySchema.items.$ref);
      if (resolved && resolved.schema) {
        copied = JSON.parse(JSON.stringify(resolved.schema));
        copied = sanitizeReadonlyPropertiesFromRequired(copied);
        copied = resolveAndSanitizeRequestBodySchema(copied, v);
        requestBodySchema.items = copied;
      }
    }
  } else if ('allOf' in requestBodySchema) {
    requestBodySchema.allOf = requestBodySchema.allOf.map((val):
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.NonArraySchemaObject
      | OpenAPIV3.ArraySchemaObject => {
      val = sanitizeReadonlyPropertiesFromRequired(val);
      return resolveAndSanitizeRequestBodySchema(val, v);
    });
  } else if ('oneOf' in requestBodySchema) {
    requestBodySchema.oneOf = requestBodySchema.oneOf.map((val):
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.NonArraySchemaObject
      | OpenAPIV3.ArraySchemaObject => {
      val = sanitizeReadonlyPropertiesFromRequired(val);
      return resolveAndSanitizeRequestBodySchema(val, v);
    });
  } else if ('anyOf' in requestBodySchema) {
    requestBodySchema.anyOf = requestBodySchema.anyOf.map((val):
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.NonArraySchemaObject
      | OpenAPIV3.ArraySchemaObject => {
      val = sanitizeReadonlyPropertiesFromRequired(val);
      return resolveAndSanitizeRequestBodySchema(val, v);
    });
  }
  return requestBodySchema;
}

function sanitizeReadonlyPropertiesFromRequired(
  schema:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.NonArraySchemaObject
    | OpenAPIV3.ArraySchemaObject
) {
  if ('properties' in schema && 'required' in schema) {
    const readOnlyProps = Object.keys(schema.properties).map((key) => {
      const prop = schema.properties[key];
      if (prop && 'readOnly' in prop) {
        if (prop.readOnly === true) {
          return key;
        }
      }
      return;
    });
    readOnlyProps
      .filter((i) => i !== undefined)
      .forEach((value) => {
        const index = schema.required.indexOf(value);
        if (index !== -1) {
          schema.required.splice(index, 1);
        }
      });
  }
  return schema;
}

function recursiveTransformOpenAPIV3Definitions(object) {
  // Transformations //
  // OpenAPIV3 nullable
  if (object.nullable === true) {
    if (object.enum) {
      // Enums can not be null with type null
      object.oneOf = [
        { type: 'null' },
        {
          type: object.type,
          enum: object.enum,
        },
      ];
      delete object.type;
      delete object.enum;
    } else if (object.type) {
      object.type = [object.type, 'null'];
    } else if (object.allOf) {
      object.anyOf = [{ allOf: object.allOf }, { type: 'null' }];
      delete object.allOf;
    } else if (object.oneOf || object.anyOf) {
      const arr: any[] = object.oneOf || object.anyOf;
      arr.push({ type: 'null' });
    }

    delete object.nullable;
  }
  Object.keys(object).forEach((attr) => {
    if (typeof object[attr] === 'object' && object[attr] !== null) {
      recursiveTransformOpenAPIV3Definitions(object[attr]);
    } else if (Array.isArray(object[attr])) {
      object[attr].forEach((obj) =>
        recursiveTransformOpenAPIV3Definitions(obj)
      );
    }
  });
}

function transformOpenAPIV3Definitions(schema) {
  if (typeof schema !== 'object') {
    return schema;
  }
  const res = JSON.parse(JSON.stringify(schema));
  recursiveTransformOpenAPIV3Definitions(res);
  return res;
}

function getHeaderValue(
  requestHeaders: { [key: string]: any },
  header: string
) {
  const matchingHeaders = Object.keys(requestHeaders).filter(
    (key) => key.toLowerCase() === header.toLowerCase()
  );
  return requestHeaders[matchingHeaders[0]];
}
