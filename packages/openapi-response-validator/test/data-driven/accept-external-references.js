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
  inputResponseBody: { foo: 'asdf' },

  expectedValidationError: void 0,
};
