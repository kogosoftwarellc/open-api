var loggingKey = require('./package.json').name;
var fs = require('fs');
var Validator = require('jsonschema').Validator;
var v = new Validator();
var jsonSchema = JSON.parse(fs.readFileSync(require.resolve('json-schema/draft-04/schema'), 'utf8'));
var swaggerSchema = require('swagger-schema-official/schema.json');

v.addSchema(jsonSchema, 'http://json-schema.org/draft-04/schema#');
v.addSchema(swaggerSchema, 'http://swagger.io/v2/schema.json#');

module.exports = {
  validate: validate
};

function validate(openapiDoc) {
  return v.validate(openapiDoc, swaggerSchema);
}
