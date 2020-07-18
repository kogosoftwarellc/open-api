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
    headers: {},
    query: {},
  },

  headers: {
    'x-foo': 5.345,
  },

  params: null,

  query: {
    foo: 'asdf',
  },
};
