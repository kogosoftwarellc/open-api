import * as Ajv from 'ajv';
import { convertParametersToJSONSchema } from 'openapi-jsonschema-parameters';
import { IJsonSchema, OpenAPI, OpenAPIV3 } from 'openapi-types';
const LOCAL_DEFINITION_REGEX = /^#\/([^\/]+)\/([^\/]+)$/;

export interface IOpenAPIRequestValidator {
  validate(request: OpenAPI.Request);
}

export interface OpenAPIRequestValidatorArgs {
  customFormats?: {
    [formatName: string]: Ajv.FormatValidator | Ajv.FormatDefinition;
  };
  externalSchemas?: {
    [index: string]: IJsonSchema;
  };
  loggingKey?: string;
  parameters: OpenAPI.Parameters;
  requestBody?: OpenAPIV3.RequestBodyObject;
  schemas?: IJsonSchema[];
  errorTransformer?(
    openAPIResponseValidatorValidationError: OpenAPIRequestValidatorError,
    ajvError: Ajv.ErrorObject
  ): any;
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
  private errorMapper: (ajvError: Ajv.ErrorObject) => any;
  private isBodyRequired: boolean;
  private requestBody: OpenAPIV3.RequestBodyObject;
  private requestBodyValidators: RequestBodyValidators = {};
  private validateBody: Ajv.ValidateFunction;
  private validateFormData: Ajv.ValidateFunction;
  private validateHeaders: Ajv.ValidateFunction;
  private validatePath: Ajv.ValidateFunction;
  private validateQuery: Ajv.ValidateFunction;

  constructor(args: OpenAPIRequestValidatorArgs) {
    const loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
    if (!args) {
      throw new Error(`${loggingKey}missing args argument`);
    }

    if (!Array.isArray(args.parameters)) {
      throw new Error(`${loggingKey}args.parameters must be an Array`);
    }

    const schemas = convertParametersToJSONSchema(args.parameters);
    const errorTransformer =
      typeof args.errorTransformer === 'function' && args.errorTransformer;
    const errorMapper = errorTransformer
      ? extendedErrorMapper(errorTransformer)
      : toOpenapiValidationError;
    const bodySchema = schemas.body;
    let bodyValidationSchema;
    const headersSchema = lowercasedHeaders(schemas.headers);
    const formDataSchema = schemas.formData;
    const pathSchema = schemas.path;
    const querySchema = schemas.query;

    const v = new Ajv({
      allErrors: true,
      unknownFormats: 'ignore',
      missingRefs: 'fail',
      // @ts-ignore TODO get Ajv updated to account for logger
      logger: false
    });

    let isBodyRequired;
    if (args.requestBody) {
      isBodyRequired = args.requestBody.required || false;
    } else {
      isBodyRequired =
        // @ts-ignore
        args.parameters.filter(byRequiredBodyParameters).length > 0;
    }

    if (args.customFormats) {
      let hasNonFunctionProperty;
      Object.keys(args.customFormats).forEach(format => {
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

    if (bodySchema) {
      bodyValidationSchema = {
        properties: {
          body: bodySchema
        }
      };
    }

    if (args.schemas) {
      if (Array.isArray(args.schemas)) {
        args.schemas.forEach(schema => {
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

            v.addSchema(schema, id);
          } else {
            console.warn(loggingKey, 'igorning schema without id property');
          }
        });
      } else if (bodySchema) {
        bodyValidationSchema.definitions = args.schemas;
      }
    }

    if (args.externalSchemas) {
      Object.keys(args.externalSchemas).forEach(id => {
        v.addSchema(args.externalSchemas[id], id);
      });
    }

    if (args.requestBody) {
      /* tslint:disable-next-line:forin */
      for (const mediaTypeKey in args.requestBody.content) {
        this.requestBodyValidators[mediaTypeKey] = v.compile({
          properties: {
            body: args.requestBody.content[mediaTypeKey].schema
          }
        });
      }
    }

    this.bodySchema = bodySchema;
    this.errorMapper = errorMapper;
    this.isBodyRequired = isBodyRequired;
    this.requestBody = args.requestBody;
    this.validateBody = bodyValidationSchema && v.compile(bodyValidationSchema);
    this.validateFormData = formDataSchema && v.compile(formDataSchema);
    this.validateHeaders = headersSchema && v.compile(headersSchema);
    this.validatePath = pathSchema && v.compile(pathSchema);
    this.validateQuery = querySchema && v.compile(querySchema);
  }

  public validate(request) {
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
          schema: this.bodySchema
        };
      }
    }

    if (this.requestBody) {
      const contentType = request.headers['content-type'];
      const mediaTypeMatch = getSchemaForMediaType(
        contentType,
        this.requestBody
      );
      if (!mediaTypeMatch) {
        mediaTypeError = {
          message: `Unsupported Content-Type ${contentType}`
        };
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
            schema: bodySchema
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
        !this.validateHeaders(lowercaseRequestHeaders(request.headers || {}))
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
        errors: errors.map(this.errorMapper)
      };
    } else if (schemaError) {
      err = {
        status: 400,
        errors: [schemaError]
      };
    } else if (mediaTypeError) {
      err = {
        status: 415,
        errors: [mediaTypeError]
      };
    }

    return err;
  }
}

interface RequestBodyValidators {
  [mediaType: string]: Ajv.ValidateFunction;
}

function byRequiredBodyParameters<T>(param: T): boolean {
  // @ts-ignore
  return (param.in === 'body' || param.in === 'formData') && param.required;
}

function extendedErrorMapper(mapper) {
  return ajvError => mapper(toOpenapiValidationError(ajvError), ajvError);
}

function getSchemaForMediaType(
  contentType: string,
  requestBodySpec: OpenAPIV3.RequestBodyObject
): string {
  const content = requestBodySpec.content;
  const subTypeWildCardPoints = 2;
  const wildcardMatchPoints = 1;
  let match: string;
  let matchPoints = 0;
  for (const mediaTypeKey in content) {
    if (content.hasOwnProperty(mediaTypeKey)) {
      if (contentType === mediaTypeKey) {
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

function lowercaseRequestHeaders(headers) {
  const lowerCasedHeaders = {};
  Object.keys(headers).forEach(header => {
    lowerCasedHeaders[header.toLowerCase()] = headers[header];
  });
  return lowerCasedHeaders;
}

function lowercasedHeaders(headersSchema) {
  if (headersSchema) {
    const properties = headersSchema.properties;
    Object.keys(properties).forEach(header => {
      const property = properties[header];
      delete properties[header];
      properties[header.toLowerCase()] = property;
    });

    if (headersSchema.required && headersSchema.required.length) {
      headersSchema.required = headersSchema.required.map(header => {
        return header.toLowerCase();
      });
    }
  }

  return headersSchema;
}

function toOpenapiValidationError(error): OpenAPIRequestValidatorError {
  const validationError: OpenAPIRequestValidatorError = {
    path: 'instance' + error.dataPath,
    errorCode: `${error.keyword}.openapi.validation`,
    message: error.message,
    location: error.location
  };

  if (error.keyword === '$ref') {
    delete validationError.errorCode;
    validationError.schema = { $ref: error.params.ref };
  }

  if (error.params.missingProperty) {
    validationError.path += '.' + error.params.missingProperty;
  }

  validationError.path = validationError.path.replace(
    error.location === 'body' ? /^instance\.body\.?/ : /^instance\.?/,
    ''
  );

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
    error.message = error.message.replace(/^instance\.body /, 'instance ');
  }

  return error;
}

function withAddedLocation(location, errors) {
  errors.forEach(error => {
    error.location = location;
  });

  return errors;
}
