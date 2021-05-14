module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              $ref: 'http://example.com/schema',
            },
          },
        },
      },
    },

    definitions: null,

    externalSchemas: {
      'http://example.com/schema': {
        type: 'string',
      },
    },
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 2345 },

  expectedValidationError: {
    message: 'The response was not valid.',
    errors: [
      {
        path: 'foo',
        errorCode: 'type.openapi.responseValidation',
        message: 'must be string',
      },
    ],
  },
};
