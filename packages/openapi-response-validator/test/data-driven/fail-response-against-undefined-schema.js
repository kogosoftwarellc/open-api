module.exports = {
  constructorArgs: {
    responses: {
      default: {}
    }
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 'asdf' },

  expectedValidationError: [
    {
      errorCode: 'type.openapi.responseValidation',
      message: 'response should be null'
    }
  ]
};
