module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              default: 'asdf',
            },
          },
          required: ['foo'],
        },
      },
    },

    definitions: null,
  },

  inputStatusCode: 200,
  inputResponseBody: {},

  expectedValidationError: void 0,
};
