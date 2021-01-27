module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            newFoo: {
              $ref: '#/components/schemas/Test1/properties/foo',
            },
            newBaz: {
              $ref:
                '#/components/schemas/Test1/properties/bar/allOf/0/properties/baz',
            },
          },
        },
      },
    },
    schemas: {
      Test1: {
        properties: {
          foo: {
            type: 'string',
          },
          bar: {
            allOf: [
              {
                type: 'object',
                properties: {
                  baz: {
                    type: 'number',
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  request: {
    body: {
      newFoo: 'asdf',
      newBaz: 123,
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
