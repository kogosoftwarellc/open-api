import Ajv, {
  FormatDefinition,
  Format,
  ErrorObject,
  ValidateFunction,
} from 'ajv';
import { IJsonSchema, OpenAPIV2, OpenAPIV3 } from 'openapi-types';

const LOCAL_DEFINITION_REGEX = /^#\/([^\/]+)\/([^\/]+)$/;

export interface IOpenAPIResponseValidator {
  validateResponse(
    statusCode: string,
    response: any
  ): void | OpenAPIResponseValidatorValidationError;
}

export interface OpenAPIResponseValidatorArgs {
  customFormats?: {
    [formatName: string]: Format | FormatDefinition<string | number>;
  };
  definitions?: {
    [definitionName: string]: IJsonSchema;
  };
  components?: OpenAPIV3.ComponentsObject;
  externalSchemas?: {
    [index: string]: IJsonSchema;
  };
  loggingKey?: string;
  responses: {
    [responseCode: string]: {
      schema: OpenAPIV2.Schema | OpenAPIV3.SchemaObject;
    };
  };

  errorTransformer?(
    openAPIResponseValidatorValidationError: OpenAPIResponseValidatorError,
    ajvError: ErrorObject
  ): any;
}

export interface OpenAPIResponseValidatorError {
  path?: string;
  errorCode: string;
  message: string;
}

export interface OpenAPIResponseValidatorValidationError {
  message: string;
  errors?: any[];
}

export default class OpenAPIResponseValidator
  implements IOpenAPIResponseValidator {
  private errorMapper: (ajvError: ErrorObject) => any;
  private validators: {
    [responseCode: string]: ValidateFunction;
  };

  constructor(args: OpenAPIResponseValidatorArgs) {
    const loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
    if (!args) {
      throw new Error(`${loggingKey}missing args argument`);
    }

    if (!args.responses) {
      throw new Error(`${loggingKey}args.responses must be an Object`);
    }

    if (!Object.keys(args.responses).length) {
      throw new Error(
        `${loggingKey}args.responses must contain at least 1 response object`
      );
    }

    const errorTransformer =
      typeof args.errorTransformer === 'function' && args.errorTransformer;

    const v = new Ajv({
      useDefaults: true,
      allErrors: true,
      strict: false,
      // @ts-ignore TODO get Ajv updated to account for logger
      logger: false,
    });

    this.errorMapper = errorTransformer
      ? makeErrorMapper(errorTransformer)
      : toOpenapiValidationError;

    if (args.customFormats) {
      Object.keys(args.customFormats).forEach((format) => {
        const func = args.customFormats[format];
        if (typeof func === 'function') {
          v.addFormat(format, func);
        }
      });
    }

    if (args.externalSchemas) {
      Object.keys(args.externalSchemas).forEach((id) => {
        v.addSchema(args.externalSchemas[id], id);
      });
    }

    const schemas = getSchemas(
      args.responses,
      args.definitions,
      args.components
    );
    this.validators = compileValidators(v, schemas);
  }

  public validateResponse(statusCode, response) {
    let validator;

    if (statusCode && statusCode in this.validators) {
      validator = this.validators[statusCode];
    } else if (
      statusCode &&
      statusCode.toString()[0] + 'XX' in this.validators
    ) {
      validator = this.validators[statusCode.toString()[0] + 'XX'];
    } else if (this.validators.default) {
      validator = this.validators.default;
    } else {
      const message =
        'An unknown status code was used and no default was provided.';
      return {
        message,
        errors: [
          {
            message,
          },
        ],
      };
    }

    const isValid = validator({
      response: response === undefined ? null : response,
    });

    if (!isValid) {
      return {
        message: 'The response was not valid.',
        errors: validator.errors.map(this.errorMapper),
      };
    }

    return undefined;
  }
}

function compileValidators(v, schemas) {
  const validators = {};

  Object.keys(schemas).forEach((name) => {
    validators[name] = v.compile(transformOpenAPIV3Definitions(schemas[name]));
  });

  return validators;
}

function getSchemas(responses, definitions, components) {
  const schemas = {};

  Object.keys(responses).forEach((name) => {
    const response = responses[name];
    const schema = response
      ? typeof response.schema === 'object'
        ? response.schema
        : typeof response.content === 'object' &&
          typeof response.content[Object.keys(response.content)[0]] ===
            'object' &&
          typeof response.content[Object.keys(response.content)[0]].schema ===
            'object'
        ? response.content[Object.keys(response.content)[0]].schema
        : { type: 'null' }
      : { type: 'null' };

    schemas[name] = {
      $schema: 'http://json-schema.org/schema#',
      type: 'object',
      properties: {
        response: schema,
      },
      definitions: definitions || {},
      components: components || {},
    };
  });

  return schemas;
}

function makeErrorMapper(mapper): (ajvError: ErrorObject) => any {
  return (ajvError) => mapper(toOpenapiValidationError(ajvError), ajvError);
}

function toOpenapiValidationError(
  error: ErrorObject
): OpenAPIResponseValidatorError {
  const validationError = {
    path: `instance${error.instancePath}`,
    errorCode: `${error.keyword}.openapi.responseValidation`,
    message: error.message,
  };

  validationError.path = validationError.path.replace(
    /^instance\/(response\/)?/,
    ''
  );

  return validationError;
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
  // Remove writeOnly properties from required array
  if (object.properties && object.required) {
    const writeOnlyProps = Object.keys(object.properties).filter(
      (key) => object.properties[key].writeOnly
    );
    writeOnlyProps.forEach((value) => {
      const index = object.required.indexOf(value);
      object.required.splice(index, 1);
    });
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
