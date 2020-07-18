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
    schemas: {
      Test1: {
        $ref: 'http://example.com/schema1',
      },
      Test2: {
        $ref: 'http://example.com/schema2#/definitions/Test',
      },
    },
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
    body: {
      test1: {
        foo: 'asdf',
      },
      test2: {
        boo: 'ccccc',
      },
    },
  },
};
