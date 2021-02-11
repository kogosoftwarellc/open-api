module.exports = {
  constructorArgs: {
    responses: {
      '2XX': {
        schema: {
          type: 'object',
          properties: {
            foo: {
              nullable: true,
              oneOf: [{ type: 'string' }, { type: 'boolean' }],
            },
          },
        },
      },
    },
  },

  inputStatusCode: 200,
  inputResponseBody: {
    foo: null,
  },

  expectedValidationError: void 0,
};
