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
    },

    definitions: null,
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 'asdf' },

  expectedValidationError: void 0,
};
