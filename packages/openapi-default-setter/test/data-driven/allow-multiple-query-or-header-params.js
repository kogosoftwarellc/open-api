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
        in: 'query',
        name: 'boo',
        type: 'string',
        default: 'fsdf',
      },

      {
        in: 'header',
        name: 'X-foo',
        type: 'number',
        default: 5.345,
      },

      {
        in: 'header',
        name: 'X-boo',
        type: 'number',
        default: 6.345,
      },
    ],
  },

  request: {
    path: '/',
    headers: {},
    query: {},
  },

  headers: {
    'x-foo': 5.345,
    'x-boo': 6.345,
  },

  params: null,

  query: {
    foo: 'asdf',
    boo: 'fsdf',
  },
};
