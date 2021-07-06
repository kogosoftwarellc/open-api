module.exports = {
  validateArgs: {
    enableHeadersLowercase: false,
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
        path: 'Foo-Bar',
        errorCode: 'required.openapi.requestValidation',
        message: "must have required property 'Foo-Bar'",
        location: 'headers',
      },
    ],
  },
};
