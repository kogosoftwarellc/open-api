module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              $ref: '#/definitions/foo',
            },
          },
        },
      },
    },

    definitions: {
      foo: {
        $ref: 'http://example.com/schema#/definitions/foo',
      },
    },

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
