module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          $ref: '#/definitions/TestBody',
        },
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
        message: "can't resolve reference #/definitions/TestBody",
        schema: {
          $ref: '#/definitions/TestBody',
        },
        location: 'body',
      },
    ],
  },
};
