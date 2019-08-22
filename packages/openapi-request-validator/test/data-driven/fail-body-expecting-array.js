module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          type: 'array'
        }
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
      errorCode: 'type.openapi.validation',
      message: 'should be array',
      location: 'body'
    }
  ]
};
