module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              format: 'foo'
            }
          }
        }
      }
    },

    definitions: null,

    customFormats: {
      foo: function(input) {
        return input === 'foo';
      }
    }
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 2345 },

  expectedValidationError: [
    {
      path: 'foo',
      errorCode: 'type.openapi.responseValidation',
      message: 'foo should be string'
    }
  ]
};
