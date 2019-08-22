module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
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
    headers: {
      'content-type': 'text/plain'
    }
  },
  expectedError: [
    {
      status: 415
    },
    {
      message: 'Unsupported Content-Type text/plain'
    }
  ]
};
