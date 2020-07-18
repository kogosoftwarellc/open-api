module.exports = {
  constructorArgs: {
    responses: {
      200: {
        description: 'Ok',
        content: {
          'application/json': {
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
      },
    },
    definitions: null,
  },

  inputStatusCode: 200,

  inputResponseBody: { foo: 'asdf' },

  expectedValidationError: void 0,
};
