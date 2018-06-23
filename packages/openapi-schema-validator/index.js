var Validator = require('jsonschema').Validator;
var jsonSchema = require('jsonschema-draft4');
var openapi2Schema = require('swagger-schema-official/schema.json');
var openapi3Schema = require('./schema/openapi-3.0.json');
var merge = require('lodash.merge');

function OpenapiSchemaValidator(args) {
  this.v = new Validator();
  this.version = args && parseInt(args.version, 10) || 2;
  this.schema = merge({}, this.version === 2 ? openapi2Schema : openapi3Schema, (args || {}).extensions || {});
  this.v.addSchema(jsonSchema);
  this.v.addSchema(this.schema);
}

/**
 * Validate the provided openapiDoc against this validator's schema version and
 * return the results.
 *
 * @param openapiDoc {object} to be validated
 * @returns {object} results from the validator
 */
OpenapiSchemaValidator.prototype.validate = function validate(openapiDoc) {
  return this.v.validate(openapiDoc, this.schema);
};

module.exports = OpenapiSchemaValidator;
