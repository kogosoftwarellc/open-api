module.exports = {
  args: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'array',
        items: {
          type: 'integer',
        },
      },

      {
        in: 'query',
        name: 'boo',
        type: 'array',
        items: {
          type: 'number',
        },
      },
    ],
  },

  request: {
    path: '/',
    query: {
      foo: ['5', '6'],
      boo: '34.2345',
    },
    headers: null,
  },

  headers: null,

  params: null,

  query: {
    foo: [5, 6],
    boo: [34.2345],
  },
};
