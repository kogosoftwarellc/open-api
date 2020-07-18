module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        schema: {
          type: 'string',
          format: 'foo',
        },
      },
    ],
    schemas: null,
    customFormats: {
      foo: function (input) {
        return input === 'foo';
      },
    },
  },
  request: {
    path: '?foo=foo',
    query: {
      foo: 'foo',
    },
  },
};
