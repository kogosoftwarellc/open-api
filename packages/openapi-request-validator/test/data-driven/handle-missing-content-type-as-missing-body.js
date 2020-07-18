module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            properties: {
              foo: {
                type: 'string',
              },
            },
            required: ['foo'],
          },
        },
      },
    },
  },
  request: {
    headers: {},
  },
  expectedError: {
    status: 400,
    errors: [
      {
        errorCode: 'required.openapi.requestValidation',
        message: 'media type is not specified',
        location: 'body',
      },
    ],
  },
};
