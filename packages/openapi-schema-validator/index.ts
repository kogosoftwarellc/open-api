import * as Ajv from 'ajv';
const openapi2Schema = require('swagger-schema-official/schema.json');
const openapi3Schema = require('./resources/openapi-3.0.json');
const merge = require('lodash.merge');
import { IJsonSchema, OpenAPI } from 'openapi-types';

export interface IOpenAPISchemaValidator {
  /**
   * Validate the provided OpenAPI doc against this validator's schema version and
   * return the results.
   */
  validate(doc: OpenAPI.Document): OpenAPISchemaValidatorResult;
}

export interface OpenAPISchemaValidatorArgs {
  version: number | string;
  extensions?: IJsonSchema;
}

export interface OpenAPISchemaValidatorResult {
  errors: Ajv.ErrorObject[];
}

export default class OpenAPISchemaValidator implements IOpenAPISchemaValidator {
  private validator: Ajv.ValidateFunction;
  constructor(args: OpenAPISchemaValidatorArgs) {
    const v = new Ajv({ schemaId: 'auto', allErrors: true });
    v.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
    const version = (args && parseInt(String(args.version), 10)) || 2;
    const schema = merge(
      {},
      version === 2 ? openapi2Schema : openapi3Schema,
      args ? args.extensions : {}
    );
    v.addSchema(schema);
    this.validator = v.compile(schema);
  }

  public validate(openapiDoc: OpenAPI.Document): OpenAPISchemaValidatorResult {
    if (!this.validator(openapiDoc)) {
      return { errors: this.validator.errors };
    } else {
      return { errors: [] };
    }
  }
}
