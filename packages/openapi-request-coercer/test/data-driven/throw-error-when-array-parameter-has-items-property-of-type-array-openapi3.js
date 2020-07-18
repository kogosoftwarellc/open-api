module.exports = {
  constructorError: /openapi-coercion: nested arrays are not allowed \(items was of type array\)/,

  args: {
    loggingKey: 'openapi-coercion',
    parameters: [
      {
        name: 'foo',
        in: 'query',
        schema: {
          type: 'array',
          items: {
            schema: {
              type: 'array',
            },
          },
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
