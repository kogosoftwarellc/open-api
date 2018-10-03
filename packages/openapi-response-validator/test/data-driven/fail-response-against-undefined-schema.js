module.exports = {
  constructorArgs: {
    responses: {
      default: {}
    }
  },

  inputStatusCode: 200,
  inputResponseBody: {foo: 'asdf'},

  expectedValidationError: {
    message: 'The response was not valid.',
    errors: [
      {
        errorCode: 'type.openapi.responseValidation',
        message: 'response should be null'
      }
    ]
  }
};
