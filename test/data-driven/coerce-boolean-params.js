module.exports = {
  args: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'boolean'
      },

      {
        in: 'path',
        name: 'path2',
        type: 'boolean'
      },

      {
        in: 'query',
        name: 'query1',
        type: 'boolean'
      },

      {
        in: 'query',
        name: 'query2',
        type: 'boolean'
      }
    ]
  },

  requestPath: '/true/false?query1=true&query2=false',

  requestHeaders: null,

  headers: null,

  params: {
    path1: true,
    path2: false
  },

  query: {
    query1: true,
    query2: false
  }
};
