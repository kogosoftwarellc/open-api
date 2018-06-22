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
        type: 'boolean',
		"x-express-openapi-coercion-strict": true
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
        type: 'boolean',
		"x-express-openapi-coercion-strict": true
      }
    ]
  },

  requestPath: '/invalid/invalid?query1=true&query2=invalid&query3=invalid',

  requestHeaders: null,

  headers: null,

  params: {
    path1: true,
    path2: null,
  },

  query: {
    query1: true,
    query2: true,
    query3: null
  }
};
