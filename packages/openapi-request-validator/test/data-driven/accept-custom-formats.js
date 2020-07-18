module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        format: 'foo',
      },
    ],
    schemas: null,
    customFormats: {},
  },
  request: {
    path: '?foo=foo',
    query: {
      foo: 'foo',
    },
  },
};
