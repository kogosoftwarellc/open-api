module.exports = {
  constructorArgs: {
    responses: {
      default: {},
    },
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 'asdf' },

  expectedValidationError: {
    message: 'The response was not valid.',
    errors: [
      {
        path: 'response',
        errorCode: 'type.openapi.responseValidation',
        message: 'must be null',
      },
    ],
  },
};
