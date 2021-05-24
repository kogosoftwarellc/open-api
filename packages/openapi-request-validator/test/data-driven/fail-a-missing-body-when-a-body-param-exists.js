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
    schemas: [
      {
        id: '#/definitions/TestBody',
        properties: {
          foo: {
            type: 'string',
          },
        },
      },
    ],
  },
  request: {},
  expectedError: {
    status: 400,
    errors: [
      {
        location: 'body',
        message:
          'request.body was not present in the request.  Is a body-parser being used?',
        schema: {
          $ref: '#/definitions/TestBody',
        },
      },
    ],
  },
};
