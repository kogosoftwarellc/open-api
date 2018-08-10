module.exports = {
  constructorArgs: {
    responses: {
      default: {}
    }
  },

  inputStatusCode: 200,
  inputResponseBody: {foo: 'asdf'},

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
