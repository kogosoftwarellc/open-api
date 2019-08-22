module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              type: 'string'
            }
          }
        }
      }
    },

    definitions: null,

    errorTransformer: function(openapiError, jsonschemaError) {
      return { errors: arguments.length };
    }
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 2345 },

  expectedValidationError: [
    {
      errors: 2
    }
  ]
};
