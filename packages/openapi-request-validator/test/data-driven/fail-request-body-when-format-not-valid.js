module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            properties: {
              foo: {
                type: 'string',
                format: 'uuid',
              },
            },
            required: ['foo'],
          },
        },
      },
    },
  },
  request: {
    body: {
      foo: 'a-non-uuid-value',
    },
    headers: {
      'content-type': 'application/json',
    },
  },

  expectedError: {
    status: 400,
    errors: [
      {
        errorCode: 'format.openapi.requestValidation',
        message: 'must match format "uuid"',
        location: 'body',
        path: 'foo',
      },
    ],
  },
};
