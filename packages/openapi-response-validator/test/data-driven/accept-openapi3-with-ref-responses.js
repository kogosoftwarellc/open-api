module.exports = {
  constructorArgs: {
    responses: {
      200: {
        description: 'Ok',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Foo',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Foo: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string',
            },
          },
        },
      },
    },
  },

  inputStatusCode: 200,

  inputResponseBody: { id: 'asdf' },

  expectedValidationError: void 0,
};
