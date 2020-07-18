module.exports = {
  constructorError: /openapi-coercion: items is a required property with type array/,

  args: {
    loggingKey: 'openapi-coercion',
    parameters: [
      {
        name: 'foo',
        in: 'query',
        schema: {
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
