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
                type: 'string'
              }
            },
            required: ['foo']
          }
        }
      }
    }
  },
  request: {
    headers: {}
  },
  expectedError: [
    {
      status: 400
    },
    {
      errorCode: 'required.openapi.validation',
      message: 'media type is not specified',
      location: 'body'
    }
  ]
};
