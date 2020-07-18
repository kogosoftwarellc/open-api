module.exports = {
  args: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        default: 'asdf',
      },

      {
        in: 'header',
        name: 'X-foo',
        type: 'number',
        default: 5.345,
      },
    ],
  },

  request: {
    path: '/',
    query: {
      foo: 'fdsa',
    },
    headers: {
      'x-foo': '78',
    },
  },

  headers: {
    'x-foo': '78',
  },

  params: null,

  query: {
    foo: 'fdsa',
  },
};
