var loggingKey = require('./package.json').name;
var fs = require('fs');
var Validator = require('jsonschema').Validator;
var v = new Validator();
var jsonSchema = require('jsonschema-draft4');
var swagger2Schema = require('swagger-schema-official/schema.json');
var swagger3Schema = require('./schema/openapi-3.0.json');

v.addSchema(jsonSchema);
v.addSchema(swagger2Schema);
v.addSchema(swagger3Schema);

module.exports = {
  validate: validate
};

/**
 * Runs specified validator against the provided openapiDocument and returns the results.
 * Previously the second param was unused. To maintain backward compatibility, if anything other than a
 * Number is passed, the v2 validator will be used.
 *
 * @param openapiDoc {object} to be validated
 * @param version {Number} defaults to 2 if unspecified or invalid type is passed
 * @returns {object} results from the validator
 */
function validate(openapiDoc, version) {
  version = parseInt(version, 10) || 2; // default to swagger 2.0 validation
  return v.validate(openapiDoc, version === 2 ? swagger2Schema : swagger3Schema);
}
