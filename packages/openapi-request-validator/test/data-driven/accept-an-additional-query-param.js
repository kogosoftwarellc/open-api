module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        required: true,
      },
    ],
    schemas: {},
  },
  request: {
    query: {
      foo: 'asdf',
      additional1: 'bbbbb',
    },
  },
};
