module.exports = {
  constructorError: /express-openapi-coercion: items is a required property with type array/,

  args: {
    parameters: [
      {
        name: 'foo',
        in: 'query',
        type: 'array'
      }
    ]
  },

  requestPath: '',

  requestHeaders: null,

  headers: null,
  params: null,
  query: null
};
