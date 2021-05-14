module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          properties: {
            test1: {
              $ref: '#/definitions/Test1',
            },
            test2: {
              $ref: '#/definitions/Test2',
            },
          },
          required: ['test1', 'test2'],
        },
      },
    ],
    schemas: [
      {
        id: '#/definitions/Test1',
        properties: {
          foo: {
            type: 'string',
          },
        },
        required: ['test1'],
      },
      {
        id: '#/definitions/Test2',
        properties: {
          boo: {
            type: 'string',
          },
        },
        required: ['test2'],
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
        path: 'test1',
        errorCode: 'required.openapi.requestValidation',
        message: "must have required property 'test1'",
        location: 'body',
      },
      {
        path: 'test2',
        errorCode: 'required.openapi.requestValidation',
        message: "must have required property 'test2'",
        location: 'body',
      },
    ],
  },
};
