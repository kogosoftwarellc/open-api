module.exports = {
  constructorArgs: {
    responses: {
      '2XX': {
        schema: {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              nullable: true,
              enum: ['HOME', 'CAR'],
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
