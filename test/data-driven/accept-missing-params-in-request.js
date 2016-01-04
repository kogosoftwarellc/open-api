module.exports = {
  args: {
    parameters: [
      {
        in: 'header',
        name: 'X-Foo',
        type: 'integer'
      },

      {
        in: 'path',
        name: 'path1',
        type: 'integer'
      },

      {
        in: 'query',
        name: 'foo',
        type: 'boolean'
      }
    ]
  },

  requestPath: '',

  requestHeaders: null,

  headers: null,
  params: null,
  query: null
};
