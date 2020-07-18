module.exports = {
  args: {
    parameters: [
      {
        in: 'header',
        name: 'X-Foo',
        type: 'boolean',
      },

      {
        in: 'path',
        name: 'path1',
        type: 'integer',
      },

      {
        in: 'path',
        name: 'path2',
        type: 'number',
      },

      {
        in: 'query',
        name: 'foo',
        type: 'boolean',
      },

      {
        in: 'query',
        name: 'boo',
        type: 'string',
      },
    ],
  },

  request: {
    path: '/5/6.35',
    params: {
      path1: '5',
      path2: '6.35',
    },
    query: {
      foo: 'false',
      boo: 'asdf',
    },
    headers: {
      'x-foo': 'false',
    },
  },

  headers: {
    'x-foo': false,
  },

  params: {
    path1: 5,
    path2: 6.35,
  },

  query: {
    foo: false,
    boo: 'asdf',
  },
};
