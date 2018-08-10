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
      },

      400: {
      }
    },

    definitions: null
  },

  inputStatusCode: 400,
  inputResponseBody: {foo: 2345},

  expectedValidationError: {
    status: 500,
    message: 'The response was not valid.',
    errors: [
      {
        errorCode: 'type.openapi.responseValidation',
        message: 'response should be null'
      }
    ]
  }
};
