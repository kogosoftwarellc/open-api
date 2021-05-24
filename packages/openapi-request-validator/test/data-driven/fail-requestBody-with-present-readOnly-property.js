module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Test1',
            },
          },
        },
      },
    },
    componentSchemas: {
      Test1: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            readOnly: true,
          },
          bar: {
            type: 'string',
          },
        },
        required: ['foo', 'bar'],
      },
    },
  },
  request: {
    body: [
      {
        bar: 'asdf',
        foo: 'should-not-be-here',
      },
    ],
    headers: {
      'content-type': 'application/json',
    },
  },

  expectedError: {
    status: 400,
    errors: [
      {
        path: '0.foo',
        errorCode: 'readOnly.openapi.requestValidation',
        message: 'is read-only',
        location: 'body',
      },
    ],
  },
};
