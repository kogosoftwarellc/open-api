module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          $ref: '#/definitions/TestBody'
        }
      }
    ],
    schemas: [
      {
        id: '#/definitions/TestBody',
        properties: {
          foo: {
            type: 'string'
          }
        },
        required: ['foo']
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
      location: 'body'
    }
  ]
};
