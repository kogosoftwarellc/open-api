module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'string',
        required: true,
      },
    ],
    schemas: null,
  },
  request: {
    path: '/f',
  },
  expectedError: {
    status: 400,
    errors: [
      {
        path: 'path1',
        errorCode: 'required.openapi.requestValidation',
        message: "must have required property 'path1'",
        location: 'path',
      },
    ],
  },
};
