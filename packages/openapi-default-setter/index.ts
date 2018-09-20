import { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';
interface DefaultMap {
  [paramName: string]: any
}

export interface OpenapiDefaultSetterArgs {
  loggingKey?: string
  parameters: OpenAPIV2.ParameterObject[] | OpenAPIV3.ParameterObject[]
}

export default class OpenapiDefaultSetter {
  private headersDefaults: DefaultMap;
  private queryDefaults: DefaultMap;

  constructor(args: OpenapiDefaultSetterArgs) {
    const loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
    if (!args) {
      throw new Error(loggingKey + 'missing args argument');
    }

    if (!Array.isArray(args.parameters)) {
      throw new Error(loggingKey + 'args.parameters must be an Array');
    }

    this.headersDefaults = getDefaults('header', args.parameters);
    this.queryDefaults = getDefaults('query', args.parameters);
  }

  handle(request: OpenAPI.Request) {
    if (request.headers && this.headersDefaults) {
      setDefaults(request.headers, this.headersDefaults);
    }

    if (request.query && this.queryDefaults) {
      setDefaults(request.query, this.queryDefaults);
    }
  }
}

function byDefault(param) {
  return 'default' in param;
}

function byLocation(location) {
  return function(param) {
    return param.in === location;
  };
}

function getDefaults(location, parameters) {
  let defaults;

  parameters
      .filter(byDefault)
      .filter(byLocation(location))
      .forEach(function(param) {
        let name = param.name;

        if (location === 'header') {
          name = name.toLowerCase();
        }

        if (!defaults) {
          defaults = {};
        }

        defaults[name] = param.default;
      });

  return defaults;
}

function setDefaults(obj, defaults) {
  for (const name in defaults) {
    if (!(name in obj)) {
      obj[name] = defaults[name];
    }
  }
}
