module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          properties: {
            test1: {
              $ref: '#/definitions/Test1',
            },
            test2: {
              $ref: '#/definitions/Test2',
            },
          },
          required: ['test1', 'test2'],
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
      Test2: {
        properties: {
          boo: {
            type: 'string',
          },
        },
        required: ['boo'],
      },
    },
  },
  request: {
    body: {
      test1: {
        foo: 'asdf',
      },
      test2: {
        boo: 'ccccc',
      },
    },
  },
};
