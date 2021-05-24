module.exports = {
  validateArgs: {
    properties: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/TestBody',
          },
        },
      },
    },
    componentSchemas: {
      TestBody: {
        properties: {
          foo: {
            type: 'string',
          },
          bar: {
            type: 'string',
            readOnly: true,
          },
        },
        required: ['foo'],
      },
    },
  },
  request: {
    body: {},
    headers: {
      'content-type': 'application/json',
    },
  },
  expectedError: {
    status: 400,
    errors: [
      {
        path: 'foo',
        errorCode: 'required.openapi.requestValidation',
        message: "must have required property 'foo'",
        location: 'body',
      },
    ],
  },
};
