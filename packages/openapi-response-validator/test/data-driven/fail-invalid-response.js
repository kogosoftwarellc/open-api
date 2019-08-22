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

    definitions: null
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
