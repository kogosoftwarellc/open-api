module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          $ref: '#/definitions/Test1',
        },
      },
    ],
    schemas: {
      Test1: {
        properties: {
          foo: {
            type: 'string',
          },
        },
        required: ['foo'],
      },
    },
  },
  request: {
    body: {
      foo: 'asdf',
    },
  },
};
