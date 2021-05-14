module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          $ref: '#/definitions/Test1',
        },
      },
    ],
    schemas: {
      Test1: {
        properties: {
          foo: {
            type: 'string',
          },
        },
        required: ['foo'],
      },
    },
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
        message: "must have required property 'foo'",
        location: 'body',
      },
    ],
  },
};
