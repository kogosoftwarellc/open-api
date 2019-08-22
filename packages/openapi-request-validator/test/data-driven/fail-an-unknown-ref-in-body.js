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
      message: "can't resolve reference #/definitions/TestBody",
      schema: {
        $ref: '#/definitions/TestBody'
      },
      location: 'body'
    }
  ]
};
