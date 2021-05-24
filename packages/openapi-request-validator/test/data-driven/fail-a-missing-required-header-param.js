module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'header',
        name: 'foo',
        type: 'string',
        required: true,
      },
    ],
    schemas: null,
  },
  request: {},
  expectedError: {
    status: 400,
    errors: [
      {
        path: 'foo',
        errorCode: 'required.openapi.requestValidation',
        message: "must have required property 'foo'",
        location: 'headers',
      },
    ],
  },
};
