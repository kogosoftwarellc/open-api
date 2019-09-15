import { IJsonSchema, OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';

export interface OpenAPIParametersAsJSONSchema {
  body?: IJsonSchema;
  formData?: IJsonSchema;
  headers?: IJsonSchema;
  path?: IJsonSchema;
  query?: IJsonSchema;
}

export function convertParametersToJSONSchema(
  parameters: OpenAPI.Parameters
): OpenAPIParametersAsJSONSchema {
  const parametersSchema: OpenAPIParametersAsJSONSchema = {};
  const bodySchema = getBodySchema(parameters);
  const formDataSchema = getSchema(parameters, 'formData');
  const headerSchema = getSchema(parameters, 'header');
  const pathSchema = getSchema(parameters, 'path');
  const querySchema = getSchema(parameters, 'query');

  if (bodySchema) {
    parametersSchema.body = bodySchema;
  }

  if (formDataSchema) {
    parametersSchema.formData = formDataSchema;
  }

  if (headerSchema) {
    parametersSchema.headers = headerSchema;
  }

  if (pathSchema) {
    parametersSchema.path = pathSchema;
  }

  if (querySchema) {
    parametersSchema.query = querySchema;
  }

  return parametersSchema;
}

const VALIDATION_KEYWORDS = [
  'additionalItems',
  'default',
  'example',
  'description',
  'enum',
  'exclusiveMaximum',
  'exclusiveMinimum',
  'format',
  'items',
  'maxItems',
  'maxLength',
  'maximum',
  'minItems',
  'minLength',
  'minimum',
  'multipleOf',
  'pattern',
  'title',
  'type',
  'uniqueItems'
];

function copyValidationKeywords(src) {
  const dst = {};
  for (let i = 0, keys = Object.keys(src), len = keys.length; i < len; i++) {
    const keyword = keys[i];

    if (
      VALIDATION_KEYWORDS.indexOf(keyword) > -1 ||
      keyword.slice(0, 2) === 'x-'
    ) {
      dst[keyword] = src[keyword];
    }
  }
  return dst;
}

function handleNullable(params, paramSchema, param) {
  if (params.nullable) {
    if (param.hasOwnProperty('examples')) {
      paramSchema.examples = param.examples;
    }
    return {
      anyOf: [paramSchema, { type: 'null' }]
    };
  }

  if (param.hasOwnProperty('examples')) {
    paramSchema.examples = param.examples;
  }
  return paramSchema;
}

function getBodySchema(parameters) {
  let bodySchema = parameters.filter(param => {
    return param.in === 'body' && param.schema;
  })[0];

  if (bodySchema) {
    bodySchema = bodySchema.schema;
  }

  return bodySchema;
}

function getSchema(parameters, type) {
  const params = parameters.filter(byIn(type));
  let schema;

  if (params.length) {
    schema = { properties: {} };

    params.forEach(param => {
      const paramSchema = copyValidationKeywords(param.schema || param);

      schema.properties[param.name] = handleNullable(
        param.schema || param,
        paramSchema,
        param
      );
    });

    schema.required = getRequiredParams(params);
  }

  return schema;
}

function getRequiredParams(parameters) {
  return parameters.filter(byRequired).map(toName);
}

function byIn(str) {
  return param => param.in === str && param.type !== 'file';
}

function byRequired(param) {
  return !!param.required;
}

function toName(param) {
  return param.name;
}
