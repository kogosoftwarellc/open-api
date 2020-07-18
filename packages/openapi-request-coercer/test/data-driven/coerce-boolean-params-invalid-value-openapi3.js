module.exports = {
  args: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        schema: {
          type: 'boolean',
        },
      },

      {
        in: 'path',
        name: 'path2',
        schema: {
          type: 'boolean',
        },
        'x-openapi-coercion-strict': true,
      },

      {
        in: 'query',
        name: 'query1',
        schema: {
          type: 'boolean',
        },
      },

      {
        in: 'query',
        name: 'query2',
        schema: {
          type: 'boolean',
        },
      },

      {
        in: 'query',
        name: 'query3',
        schema: {
          type: 'boolean',
        },
        'x-openapi-coercion-strict': true,
      },
    ],
  },

  request: {
    path: '/invalid/invalid',
    params: {
      path1: 'invalid',
      path2: 'invalid',
    },
    query: {
      query1: 'true',
      query2: 'invalid',
      query3: 'invalid',
    },
    headers: null,
  },

  headers: null,

  params: {
    path1: true,
    path2: null,
  },

  query: {
    query1: true,
    query2: true,
    query3: null,
  },
};
