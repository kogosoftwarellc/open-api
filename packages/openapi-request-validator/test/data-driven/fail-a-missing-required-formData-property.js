module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'formData',
        name: 'foo',
        type: 'string',
        required: true,
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
        path: 'foo',
        errorCode: 'required.openapi.requestValidation',
        message: "should have required property 'foo'",
        location: 'formData',
      },
    ],
  },
};
