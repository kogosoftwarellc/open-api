module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          type: 'array',
        },
      },
    ],
  },
  request: {
    body: {},
  },
  expectedError: {
    status: 400,
    errors: [
      {
        errorCode: 'type.openapi.requestValidation',
        message: 'must be array',
        location: 'body',
      },
    ],
  },
};
