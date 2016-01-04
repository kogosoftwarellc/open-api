module.exports = {
  constructorError: /express-openapi-coercion: nested arrays are not allowed \(items was of type array\)/,

  args: {
    parameters: [
      {
        name: 'foo',
        in: 'query',
        type: 'array',
        items: {
          type: 'array'
        }
      }
    ]
  },

  requestPath: '',

  requestHeaders: null,

  headers: null,
  params: null,
  query: null
};
