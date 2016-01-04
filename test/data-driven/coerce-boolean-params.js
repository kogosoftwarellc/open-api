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
      }
    ]
  },

  requestPath: '/true/false',

  requestHeaders: null,

  headers: null,

  params: {
    path1: true,
    path2: false
  },

  query: null
};
