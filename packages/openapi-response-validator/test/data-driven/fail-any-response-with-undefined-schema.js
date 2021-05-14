module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
            },
          },
        },
      },

      400: {},
    },

    definitions: null,
  },

  inputStatusCode: 400,
  inputResponseBody: { foo: 2345 },

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
