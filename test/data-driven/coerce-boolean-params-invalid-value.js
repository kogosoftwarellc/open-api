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
      }, 
      
      {
        in: 'query',
        name: 'query3',
        type: 'boolean'
      }
    ]
  },

  requestPath: '/true/invalid?query1=true&query2=invalid&query3=false',

  requestHeaders: null,

  headers: null,

  params: {
    path1: true,
    path2: null
  },

  query: {
    query1: true,
    query2: null,
    query3: false
  }
};
