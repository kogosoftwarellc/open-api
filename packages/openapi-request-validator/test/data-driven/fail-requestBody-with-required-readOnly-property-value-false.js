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
            readOnly: false,
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
        errorCode: 'required.openapi.requestValidation',
        message: "must have required property 'foo'",
        location: 'body',
      },
    ],
  },
};
