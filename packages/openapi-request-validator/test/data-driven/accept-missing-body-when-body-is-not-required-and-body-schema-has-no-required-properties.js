module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        schema: {
          properties: {
            test1: {
              $ref: '#/definitions/Test1',
            },
            test2: {
              $ref: '#/definitions/Test2',
            },
          },
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
      },
      {
        id: '#/definitions/Test2',
        properties: {
          boo: {
            type: 'string',
          },
        },
      },
    ],
  },
  request: {},
};
