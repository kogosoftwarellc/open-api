import { OpenAPI } from 'openapi-types';
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
      coercionStrategy: args.coercionStrategy
    });
    this.coerceParams = buildCoercer({
      params: args.parameters,
      property: 'path',
      isHeaders: false,
      logger,
      loggingKey,
      strictExtensionName,
      enableObjectCoercion,
      coercionStrategy: args.coercionStrategy
    });
    this.coerceQuery = buildCoercer({
      params: args.parameters,
      property: 'query',
      isHeaders: false,
      logger,
      loggingKey,
      strictExtensionName,
      enableObjectCoercion,
      coercionStrategy: args.coercionStrategy
    });
    this.coerceFormData = buildCoercer({
      params: args.parameters,
      property: 'formData',
      isHeaders: false,
      logger,
      loggingKey,
      strictExtensionName,
      enableObjectCoercion,
      coercionStrategy: args.coercionStrategy
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

const OBJECT_FORMAT_COERCER = {
  default(input) {
    return JSON.parse(input);
  }
  // other formats
};

const COERCION_STRATEGIES = {
  array: (itemCoercer, collectionFormat, input) => {
    if (!Array.isArray(input)) {
      const sep = pathsep(collectionFormat || 'csv');
      input = input.split(sep);
    }

    input.forEach((v, i) => {
      input[i] = itemCoercer(v);
    });

    return input;
  },

  object(format, input) {
    return (OBJECT_FORMAT_COERCER[format] || OBJECT_FORMAT_COERCER.default)(
      input
    );
  },

  boolean: input => {
    if (typeof input === 'boolean') {
      return input;
    }

    if (input === 'false') {
      return false;
    } else {
      return true;
    }
  },

  integer: input => {
    const result = Math.floor(Number(input));
    return isNaN(result) ? input : result;
  },

  number: input => {
    const result = Number(input);
    return isNaN(result) ? input : result;
  },

  string: input => String(input)
};

const STRICT_COERCION_STRATEGIES = {
  boolean: input => {
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
  }
};

function buildCoercer(args) {
  const l = args.isHeaders
    ? name => {
        return name.toLowerCase();
      }
    : name => {
        return name;
      };
  let coercion;

  if (args.params.length) {
    const coercers = {};

    args.params.filter(byLocation(args.property)).forEach(param => {
      // OpenAPI (Swagger) 2.0 has type and format information as direct properties
      // of the param object. OpenAPI 3.0 has type and format information in a
      // schema object property. Use a schema value to normalize the change across
      // both versions so coercer works properly.
      const schema = param.schema || param;
      const name = param.name;
      const type = schema.type;
      const strict = !!param[args.strictExtensionName];
      let coercer;
      let itemCoercer;

      if (type === 'array') {
        let disableCoercer;
        if (!schema.items) {
          throw new Error(
            `${args.loggingKey}items is a required property with type array`
          );
        }

        if (
          schema.items.type === 'array' ||
          (schema.items.schema && schema.items.schema.type === 'array')
        ) {
          throw new Error(
            `${
              args.loggingKey
            }nested arrays are not allowed (items was of type array)`
          );
        }

        const itemsType =
          schema.items.schema && schema.items.schema.type
            ? schema.items.schema.type
            : schema.items.type;
        itemCoercer = getCoercer(
          itemsType,
          strict,
          args.logger,
          args.loggingKey,
          args.coercionStrategy
        );

        if (itemsType === 'object') {
          if (!args.enableObjectCoercion) {
            disableCoercer = true;
          } else {
            const itemsFormat = schema.items.schema
              ? schema.items.schema.format
              : schema.format;
            itemCoercer = itemCoercer.bind(null, itemsFormat);
          }
        }

        if (!disableCoercer) {
          let collectionFormat = param.collectionFormat;
          // OpenAPI 3.0 has replaced collectionFormat with a style property
          // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#style-values
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

          coercer = COERCION_STRATEGIES.array.bind(
            null,
            itemCoercer,
            collectionFormat
          );
        }
      } else if (type === 'object') {
        if (args.enableObjectCoercion) {
          coercer = getCoercer(
            schema.type,
            strict,
            args.logger,
            args.loggingKey,
            args.coercionStrategy
          ).bind(null, schema.format);
        }
      } else {
        coercer = getCoercer(
          schema.type,
          strict,
          args.logger,
          args.loggingKey,
          args.coercionStrategy
        );
      }

      if (coercer) {
        coercers[l(name)] = coercer;
      }
    });

    coercion = obj => {
      for (const paramName in obj) {
        if (paramName in coercers) {
          obj[paramName] = coercers[paramName](obj[paramName]);
        }
      }
    };
  }

  return coercion;
}

function byLocation(location) {
  return param => param.in === location;
}

function identityCoercer(input: any) {
  return input;
}

function getCoercer(
  type: string,
  strict: boolean,
  logger: Logger,
  loggingKey: string,
  customStrategy: CoercionStrategy
) {
  let strategy;
  if (customStrategy[type] !== undefined) {
    strategy = customStrategy[type];
  }
  if (strategy === undefined && strict) {
    strategy = STRICT_COERCION_STRATEGIES[type];
  }
  if (!strategy) {
    strategy = COERCION_STRATEGIES[type];
  }
  if (strategy === undefined) {
    const msg =
      type === undefined
        ? 'No type has been defined'
        : `No proper coercion strategy has been found for type '${type}'`;

    logger.warn(
      loggingKey,
      `${msg}. A default 'identity' strategy has been set.`
    );
    strategy = identityCoercer;
  }

  return strategy;
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
