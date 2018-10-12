import { OpenAPI } from 'openapi-types';

export interface IOpenAPIRequestCoercer {
  coerce(request: OpenAPI.Request): void;
}

export interface OpenAPIRequestCoercerArgs {
  loggingKey?: string;
  extensionBase?: string;
  parameters: OpenAPI.Parameters;
}

export default class OpenAPIRequestCoercer implements IOpenAPIRequestCoercer {
  private coerceHeaders;
  private coerceParams;
  private coerceQuery;
  private coerceFormData;

  constructor(args: OpenAPIRequestCoercerArgs) {
    const loggingKey = args && args.loggingKey ?
      `${args.loggingKey}: ` :
      '';
    const extensionBase = args && args.extensionBase ?
      args.extensionBase :
      'x-openapi-coercion';
    const strictExtension = `${extensionBase}-strict`;

    if (!args) {
      throw new Error(`${loggingKey}missing args argument`);
    }

    if (!Array.isArray(args.parameters)) {
      throw new Error(`${loggingKey}args.parameters must be an Array`);
    }

    this.coerceHeaders = buildCoercer(args.parameters, 'header', true, loggingKey, strictExtension);
    this.coerceParams = buildCoercer(args.parameters, 'path', false, loggingKey, strictExtension);
    this.coerceQuery = buildCoercer(args.parameters, 'query', false, loggingKey, strictExtension);
    this.coerceFormData = buildCoercer(args.parameters, 'formData', false, loggingKey, strictExtension);
  }

  coerce(request) {
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

var OBJECT_FORMAT_COERCER = {
  default: function (input) { return JSON.parse(input) }
  //other formats
}

var COERCION_STRATEGIES = {
  array: (itemCoercer, collectionFormat, input) => {
    if (!Array.isArray(input)) {
      var sep = pathsep(collectionFormat || 'csv');
      input = input.split(sep);
    }

    input.forEach((v, i) => {
      input[i] = itemCoercer(v);
    });

    return input;
  },

  object: function (format, input) {
    return (OBJECT_FORMAT_COERCER[format] || OBJECT_FORMAT_COERCER['default'])(input);
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

  integer: input => Math.floor(Number(input)),
  number: input => Number(input),
  string: input => String(input),
};

var STRICT_COERCION_STRATEGIES = {
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
  },
};

function buildCoercer(params, property, isHeaders, loggingKey, strictExtensionName) {
  const l = isHeaders ?
    name => {
      return name.toLowerCase();
    } :
    name => {
      return name;
    };
  let coercion;

  if (params.length) {
    const coercers = {};

    params.filter(byLocation(property)).forEach(function(param) {
      const name = param.name;
      const type = param.type;
      const strict = !!param[strictExtensionName];
      let coercer;
      let itemCoercer;

      if (type === 'array') {
        if (!param.items) {
          throw new Error(loggingKey + 'items is a required property with type array');
        }

        if (param.items.type === 'array') {
          throw new Error(loggingKey + 'nested arrays are not allowed (items was of type array)');
        }

        itemCoercer = getCoercer(param.items.type, strict);

        if (param.items.type === 'object') {
          itemCoercer = itemCoercer.bind(null, param.items.format);
        }

        coercer = COERCION_STRATEGIES.array.bind(null, itemCoercer, param.collectionFormat);
      }
      else if (type === 'object') {
        coercer = getCoercer(param.type, strict).bind(null, param.format);
      }
      else {
        coercer = getCoercer(param.type, strict);
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

function getCoercer(type, strict) {
  let strategy;
  if (strict) {
    strategy = STRICT_COERCION_STRATEGIES[type];
  }
  if (!strategy) {
    strategy = COERCION_STRATEGIES[type];
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
