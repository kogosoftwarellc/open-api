module.exports = {
  args: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        default: 'asdf'
      },

      {
        in: 'header',
        name: 'X-foo',
        type: 'number',
        default: 5.345
      }
    ]
  },

  requestPath: '/?foo=fdsa',

  requestHeaders: {
    'X-FOO': 78
  },

  headers: {
    'x-foo': '78'
  },

  params: null,

  query: {
    foo: 'fdsa'
  }
};
