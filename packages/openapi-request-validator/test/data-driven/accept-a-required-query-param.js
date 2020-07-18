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
    schemas: null,
  },
  request: {
    path: '?foo=asdf',
    query: {
      foo: 'asdf',
    },
  },
};
