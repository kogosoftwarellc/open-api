var Ajv = require('ajv');
var openapi2Schema = require('swagger-schema-official/schema.json');
var openapi3Schema = require('./schema/openapi-3.0.json');
var merge = require('lodash.merge');

function OpenapiSchemaValidator(args) {
  var v = new Ajv({schemaId: 'auto', allErrors: true});
  v.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
  this.version = args && parseInt(args.version, 10) || 2;
  this.schema = merge({}, this.version === 2 ? openapi2Schema : openapi3Schema, (args || {}).extensions || {});
  v.addSchema(this.schema);
  this.validator = v.compile(this.schema);
}

/**
 * Validate the provided openapiDoc against this validator's schema version and
 * return the results.
 *
 * @param openapiDoc {object} to be validated
 * @returns {object} results from the validator
 */
OpenapiSchemaValidator.prototype.validate = function validate(openapiDoc) {
  if (!this.validator(openapiDoc)) {
    return {errors: this.validator.errors};
  } else {
    return {errors: []};
  }
};

module.exports = OpenapiSchemaValidator;
