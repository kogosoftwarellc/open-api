module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'formData',
        name: 'foo',
        type: 'string',
        required: true
      }
    ]
  },
  request: {
    body: {}
  },
  expectedError: [
    {
      status: 400
    },
    {
      path: 'foo',
      errorCode: 'required.openapi.validation',
      message: "should have required property 'foo'",
      location: 'formData'
    }
  ]
};
