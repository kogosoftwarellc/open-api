module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              $ref: 'http://example.com/schema#/definitions/foo',
            },
          },
        },
      },
    },

    definitions: null,

    externalSchemas: {
      'http://example.com/schema': {
        definitions: {
          foo: {
            type: 'string',
          },
        },
      },
    },
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 'asdf' },

  expectedValidationError: void 0,
};
