module.exports = {
  args: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        schema: {
          type: 'array',
          items: {
            schema: {
              type: 'integer',
            },
          },
        },
      },

      {
        in: 'query',
        name: 'boo',
        schema: {
          type: 'array',
          items: {
            schema: {
              type: 'number',
            },
          },
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
