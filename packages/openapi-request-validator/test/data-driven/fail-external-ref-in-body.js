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
              $ref: 'http://example.com/schema1',
            },
            test2: {
              $ref: 'http://example.com/schema2#/definitions/Test',
            },
          },
          required: ['test1', 'test2'],
        },
      },
    ],
    schemas: null,
    externalSchemas: {
      'http://example.com/schema1': {
        properties: {
          foo: {
            type: 'string',
          },
        },
        required: ['foo'],
      },
      'http://example.com/schema2': {
        definitions: {
          Test: {
            properties: {
              boo: {
                type: 'string',
              },
            },
            required: ['boo'],
          },
        },
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
