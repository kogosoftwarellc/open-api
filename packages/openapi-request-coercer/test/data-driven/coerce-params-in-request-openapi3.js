module.exports = {
  args: {
    parameters: [
      {
        in: 'header',
        name: 'X-Foo',
        schema: {
          type: 'boolean',
        },
      },

      {
        in: 'path',
        name: 'path1',
        schema: {
          type: 'integer',
        },
      },

      {
        in: 'path',
        name: 'path2',
        schema: {
          type: 'number',
        },
      },

      {
        in: 'query',
        name: 'foo',
        schema: {
          type: 'boolean',
        },
      },

      {
        in: 'query',
        name: 'boo',
        schema: {
          type: 'string',
        },
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
