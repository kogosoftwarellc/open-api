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
          },
          required: ['test1'],
        },
      },
    ],
    schemas: {
      Test1: {
        properties: {
          foo: {
            type: 'string',
          },
          recursive: {
            $ref: '#/definitions/Test1',
          },
        },
        required: ['foo'],
      },
    },
  },
  request: {
    body: {
      test1: {
        foo: 'asdf',
        recursive: {
          foo: 5,
        },
      },
    },
  },

  expectedError: {
    status: 400,
    errors: [
      {
        path: 'test1.recursive.foo',
        errorCode: 'type.openapi.requestValidation',
        message: 'must be string',
        location: 'body',
      },
    ],
  },
};
