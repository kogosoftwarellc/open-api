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

  expectedValidationError: {
    message: 'The response was not valid.',
    errors: [
      {
        errorCode: 'type.openapi.responseValidation',
        message: 'response should be object'
      }
    ]
  }
};
