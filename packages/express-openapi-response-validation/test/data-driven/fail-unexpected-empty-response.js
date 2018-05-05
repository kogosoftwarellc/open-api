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
    status: 500,
    message: 'The response was not valid.',
    errors: [
      {
        errorCode: 'type.openapi.responseValidation',
        message: 'response is not of a type(s) object'
      }
    ]
  }
};
