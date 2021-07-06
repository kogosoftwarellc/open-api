module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'header',
        name: 'Foo-Bar',
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
        path: 'foo-bar',
        errorCode: 'required.openapi.requestValidation',
        message: "must have required property 'foo-bar'",
        location: 'headers',
      },
    ],
  },
};
