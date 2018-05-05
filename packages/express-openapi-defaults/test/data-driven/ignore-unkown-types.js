module.exports = {
  args: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'asdf',
        default: 'asdf'
      },

      {
        in: 'header',
        name: 'X-foo',
        type: 'asdfasdf',
        default: 5.345
      }
    ]
  },

  requestPath: '/',

  requestHeaders: null,

  headers: {
    'x-foo': 5.345
  },

  params: null,

  query: {
    foo: 'asdf'
  }
};
