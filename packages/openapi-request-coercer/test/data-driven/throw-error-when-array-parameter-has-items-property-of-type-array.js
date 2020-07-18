module.exports = {
  constructorError: /openapi-coercion: nested arrays are not allowed \(items was of type array\)/,

  args: {
    loggingKey: 'openapi-coercion',
    parameters: [
      {
        name: 'foo',
        in: 'query',
        type: 'array',
        items: {
          type: 'array',
        },
      },
    ],
  },

  request: {
    path: '',
    headers: null,
  },

  headers: null,
  params: null,
  query: null,
};
