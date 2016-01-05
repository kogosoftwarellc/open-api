var loggingKey = require('./package.json').name;
var fs = require('fs');
var Validator = require('jsonschema').Validator;
var v = new Validator();
var jsonSchema = require('jsonschema-draft4');
var swaggerSchema = require('swagger-schema-official/schema.json');

v.addSchema(jsonSchema);
v.addSchema(swaggerSchema);

module.exports = {
  validate: validate
};

function validate(openapiDoc) {
  return v.validate(openapiDoc, swaggerSchema);
}
