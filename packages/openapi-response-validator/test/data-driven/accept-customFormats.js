module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              format: 'foo',
            },
          },
        },
      },
    },

    definitions: null,

    customFormats: {
      foo: function (input) {
        return input === 'foo';
      },
    },
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 'foo' },

  expectedValidationError: void 0,
};
