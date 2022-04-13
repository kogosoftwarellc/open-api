import { OpenAPI, OpenAPIV3 } from 'openapi-types';
import { dummyLogger, Logger } from 'ts-log';

export interface IOpenAPIRequestCoercer {
  coerce(request: OpenAPI.Request): void;
}

export interface CoercionStrategy {
  boolean?: (input: any) => any;
  number?: (input: any) => any;
  integer?: (input: any) => any;
}

export interface OpenAPIRequestCoercerArgs {
  loggingKey?: string;
  logger?: Logger;
  enableObjectCoercion?: boolean;
  extensionBase?: string;
  coercionStrategy?: CoercionStrategy;
  parameters: OpenAPI.Parameters;
  requestBody?: OpenAPIV3.RequestBodyObject;
}

export default class OpenAPIRequestCoercer implements IOpenAPIRequestCoercer {
  private coerceHeaders;
  private coerceParams;
  private coerceQuery;
  private coerceFormData;

  constructor(args: OpenAPIRequestCoercerArgs) {
    const loggingKey = args && args.loggingKey ? `${args.loggingKey}: ` : '';
    if (!args) {
      throw new Error(`${loggingKey}missing args argument`);
    }

    const logger = args.logger || dummyLogger;

    if (!Array.isArray(args.parameters)) {
      throw new Error(`${loggingKey}args.parameters must be an Array`);
    }

    if (!args.coercionStrategy) {
      args.coercionStrategy = {};
    }

    const extensionBase =
      args && args.extensionBase ? args.extensionBase : 'x-openapi-coercion';
    const strictExtensionName = `${extensionBase}-strict`;
    const enableObjectCoercion = !!args.enableObjectCoercion;

    this.coerceHeaders = buildCoercer({
      params: args.parameters,
      property: 'header',
      isHeaders: true,
      logger,
      loggingKey,
      strictExtensionName,
      enableObjectCoercion,
      coercionStrategy: args.coercionStrategy,
    });
    this.coerceParams = buildCoercer({
      params: args.parameters,
      property: 'path',
      isHeaders: false,
      logger,
      loggingKey,
      strictExtensionName,
      enableObjectCoercion,
      coercionStrategy: args.coercionStrategy,
    });
    this.coerceQuery = buildCoercer({
      params: args.parameters,
      property: 'query',
      isHeaders: false,
      logger,
      loggingKey,
      strictExtensionName,
      enableObjectCoercion,
      coercionStrategy: args.coercionStrategy,
    });
    this.coerceFormData = buildCoercer({
      params: args.parameters,
      requestBody: args.requestBody,
      property: 'formData',
      isHeaders: false,
      logger,
      loggingKey,
      strictExtensionName,
      enableObjectCoercion,
      coercionStrategy: args.coercionStrategy,
    });
  }

  public coerce(request) {
    if (request.headers && this.coerceHeaders) {
      this.coerceHeaders(request.headers);
    }

    if (request.params && this.coerceParams) {
      this.coerceParams(request.params);
    }

    if (request.query && this.coerceQuery) {
      this.coerceQuery(request.query);
    }

    if (request.body && this.coerceFormData) {
      this.coerceFormData(request.body);
    }
  }
}

function buildCoercer(args) {
  if (!args.params.length && !args.requestBody) {
    return;
  }

  const l = args.isHeaders ? (name) => name.toLowerCase() : (name) => name;

  let properties = args.params.filter(byLocation(args.property));

  if (args.property === 'formData' && args.requestBody) {
    const openapiv3formData =
      args.requestBody?.content['application/x-www-form-urlencoded']?.schema
        ?.properties;

    if (openapiv3formData) {
      properties = properties.concat(
        Object.keys(openapiv3formData).map((k) => {
          return { ...openapiv3formData[k], name: k };
        })
      );
    }
  }

  const coercers = properties.reduce((acc, param) => {
    acc[l(param.name)] = buildCoercerForParam(args, param);
    return acc;
  }, {});

  return (obj) => {
    for (const paramName in obj) {
      if (coercers.hasOwnProperty(l(paramName))) {
        obj[paramName] = coercers[l(paramName)](obj[paramName]);
      }
    }
  };
}

function buildCoercerForParam(args, param) {
  const {
    logger,
    loggingKey,
    enableObjectCoercion,
    coercionStrategy: customStrategy = {},
  } = args;
  const strict = !!param[args.strictExtensionName];

  function getCoercer(type: string) {
    const OBJECT_FORMAT_COERCER = {
      default: (schema, input) => JSON.parse(input),
      deepObject: (schema, input) => {
        for (const key of Object.keys(input)) {
          const propertySchema = schema.properties
            ? schema.properties[key]
            : schema.additionalProperties;
          if (propertySchema) {
            input[key] = getCoercer(propertySchema.type)(
              propertySchema,
              input[key]
            );
          }
        }
        return input;
      },
    };

    const COERCION_STRATEGIES = {
      array: (schema, input) => {
        if (!Array.isArray(input)) {
          let collectionFormat = param.collectionFormat;
          // OpenAPI 3.0 has replaced collectionFormat with a style property
          // https://swagger.io/docs/specification/serialization/
          if (param.style) {
            if (param.style === 'form' && param.in === 'query') {
              collectionFormat = param.explode ? 'multi' : 'csv';
            } else if (
              param.style === 'simple' &&
              (param.in === 'path' || param.in === 'header')
            ) {
              collectionFormat = 'csv';
            } else if (
              param.style === 'spaceDelimited' &&
              param.in === 'query'
            ) {
              collectionFormat = 'ssv';
            } else if (
              param.style === 'pipeDelimited' &&
              param.in === 'query'
            ) {
              collectionFormat = 'pipes';
            }
          }
          const sep = pathsep(collectionFormat || 'csv');
          input = input.split(sep);
        }

        return input.map((v, i) => {
          const itemSchema = schema.items.schema
            ? schema.items.schema
            : schema.items;
          return getCoercer(itemSchema.type)(itemSchema, v);
        });
      },

      object: (schema, input) => {
        if (!enableObjectCoercion) {
          return input;
        }
        // Similar to arrays, objects support formats. In OpenAPI 3.0, the format is called "style".
        // Currently this coercer only automatically supports the deepObject style, and a simple
        // JSON format, though the OpenAPI 3.0 specification defines many styles similar to arrays.
        const style = param.style || schema.format;
        const objectCoercer =
          OBJECT_FORMAT_COERCER[style] || OBJECT_FORMAT_COERCER.default;
        return objectCoercer(schema, input);
      },

      boolean: (schema, input) => {
        if (typeof input === 'boolean') {
          return input;
        }

        if (input === 'false') {
          return false;
        } else {
          return true;
        }
      },

      integer: (schema, input) => {
        const result = Math.floor(Number(input));
        return isNaN(result) ? input : result;
      },

      number: (schema, input) => {
        const result = Number(input);
        return isNaN(result) ? input : result;
      },

      string: (schema, input) => String(input),
    };

    const STRICT_COERCION_STRATEGIES = {
      boolean: (schema, input) => {
        if (typeof input === 'boolean') {
          return input;
        }

        if (input.toLowerCase() === 'false') {
          return false;
        } else if (input.toLowerCase() === 'true') {
          return true;
        } else {
          return null;
        }
      },
    };

    if (customStrategy[type] !== undefined) {
      return (schema, input) => customStrategy[type](input);
    }
    if (strict && STRICT_COERCION_STRATEGIES[type] !== undefined) {
      return STRICT_COERCION_STRATEGIES[type];
    }
    if (COERCION_STRATEGIES[type] !== undefined) {
      return COERCION_STRATEGIES[type];
    }
    const msg =
      type === undefined
        ? 'No type has been defined'
        : `No proper coercion strategy has been found for type '${type}'`;

    logger.warn(
      loggingKey,
      `${msg}. A default 'identity' strategy has been set.`
    );
    return (schema, input) => input;
  }

  // OpenAPI (Swagger) 2.0 has type and format information as direct properties
  // of the param object. OpenAPI 3.0 has type and format information in a
  // schema object property. Use a schema value to normalize the change across
  // both versions so coercer works properly.
  const paramOrSchema = param.schema || param;

  if (paramOrSchema.type === 'array') {
    if (!paramOrSchema.items) {
      throw new Error(
        `${args.loggingKey}items is a required property with type array`
      );
    }

    if (
      paramOrSchema.items.type === 'array' ||
      (paramOrSchema.items.schema &&
        paramOrSchema.items.schema.type === 'array')
    ) {
      throw new Error(
        `${args.loggingKey}nested arrays are not allowed (items was of type array)`
      );
    }
  }

  return getCoercer(paramOrSchema.type).bind(null, paramOrSchema);
}

function byLocation(location) {
  return (param) => param.in === location;
}

function pathsep(format) {
  switch (format) {
    case 'csv':
      return ',';
    case 'ssv':
      return ' ';
    case 'tsv':
      return '\t';
    case 'pipes':
      return '|';
  }
}
