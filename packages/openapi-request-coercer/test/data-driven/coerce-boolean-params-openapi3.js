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
    ],
  },

  request: {
    path: '/true/false',
    params: {
      path1: true,
      path2: 'false',
    },
    query: {
      query1: 'true',
      query2: 'false',
    },
    headers: null,
  },

  headers: null,

  params: {
    path1: true,
    path2: false,
  },

  query: {
    query1: true,
    query2: false,
  },
};
