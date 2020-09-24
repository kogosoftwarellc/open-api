import { IJsonSchema, OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';

export interface OpenAPIParametersAsJSONSchema {
  body?: IJsonSchema;
  formData?: IJsonSchema;
  headers?: IJsonSchema;
  path?: IJsonSchema;
  query?: IJsonSchema;
  cookie?: IJsonSchema;
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
  const cookieSchema = getSchema(parameters, 'cookie');

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

  if (cookieSchema) {
    parametersSchema.cookie = cookieSchema;
  }

  return parametersSchema;
}

const VALIDATION_KEYWORDS = [
  'additionalItems',
  'default',
  'example',
  'description',
  'enum',
  'examples',
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
  'uniqueItems',
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

function handleNullable(schema) {
  return { anyOf: [schema, { type: 'null' }] };
}

const SUBSCHEMA_KEYWORDS = [
  'additionalItems',
  'items',
  'contains',
  'additionalProperties',
  'propertyNames',
  'not',
];

const SUBSCHEMA_ARRAY_KEYWORDS = ['items', 'allOf', 'anyOf', 'oneOf'];

const SUBSCHEMA_OBJECT_KEYWORDS = [
  'definitions',
  'properties',
  'patternProperties',
  'dependencies',
];

function handleNullableSchema(schema) {
  if (typeof schema !== 'object' || schema === null) {
    return schema;
  }

  const newSchema = { ...schema };

  SUBSCHEMA_KEYWORDS.forEach((keyword) => {
    if (
      typeof schema[keyword] === 'object' &&
      schema[keyword] !== null &&
      !Array.isArray(schema[keyword])
    ) {
      newSchema[keyword] = handleNullableSchema(schema[keyword]);
    }
  });

  SUBSCHEMA_ARRAY_KEYWORDS.forEach((keyword) => {
    if (Array.isArray(schema[keyword])) {
      newSchema[keyword] = schema[keyword].map(handleNullableSchema);
    }
  });

  SUBSCHEMA_OBJECT_KEYWORDS.forEach((keyword) => {
    if (typeof schema[keyword] === 'object' && schema[keyword] !== null) {
      newSchema[keyword] = { ...schema[keyword] };
      Object.keys(schema[keyword]).forEach((prop) => {
        newSchema[keyword][prop] = handleNullableSchema(schema[keyword][prop]);
      });
    }
  });

  delete newSchema.$ref;

  if (schema.nullable) {
    delete newSchema.nullable;
    return handleNullable(newSchema);
  }
  return newSchema;
}

function getBodySchema(parameters) {
  let bodySchema = parameters.filter((param) => {
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

    params.forEach((param) => {
      let paramSchema;
      if ('schema' in param) {
        paramSchema = handleNullableSchema(param.schema);
        if ('examples' in param) {
          paramSchema.examples = getExamples(param.examples);
        }
        schema.properties[param.name] = paramSchema;
      } else {
        paramSchema = copyValidationKeywords(param);
        if ('examples' in paramSchema) {
          paramSchema.examples = getExamples(paramSchema.examples);
        }
        schema.properties[param.name] = param.nullable
          ? handleNullable(paramSchema)
          : paramSchema;
      }
    });

    schema.required = getRequiredParams(params);
  }

  return schema;
}

function getRequiredParams(parameters) {
  return parameters.filter(byRequired).map(toName);
}

function getExamples(exampleSchema) {
  return Object.keys(exampleSchema).map((k) => exampleSchema[k].value);
}

function byIn(str) {
  return (param) => param.in === str && param.type !== 'file';
}

function byRequired(param) {
  return !!param.required;
}

function toName(param) {
  return param.name;
}
