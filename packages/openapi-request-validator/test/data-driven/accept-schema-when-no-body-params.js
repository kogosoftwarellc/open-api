module.exports = {
  validateArgs: {
    parameters: [],
    schemas: {
      Test1: {
        properties: {
          foo: {
            type: 'string',
          },
        },
        required: ['foo'],
      },
      Test2: {
        properties: {
          boo: {
            type: 'string',
          },
        },
        required: ['boo'],
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
