module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'string',
        pattern: '^a$',
        required: true,
      },
    ],
    schemas: null,
  },
  request: {
    path: '/f',
    params: {
      path1: 'f',
    },
  },
  expectedError: {
    status: 400,
    errors: [
      {
        path: 'path1',
        errorCode: 'pattern.openapi.requestValidation',
        message: 'must match pattern "^a$"',
        location: 'path',
      },
    ],
  },
};
