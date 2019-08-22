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
  inputResponseBody: undefined,

  expectedValidationError: [
    {
      errorCode: 'type.openapi.responseValidation',
      message: 'response should be object'
    }
  ]
};
