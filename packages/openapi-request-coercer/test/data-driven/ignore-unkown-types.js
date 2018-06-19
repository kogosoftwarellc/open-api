module.exports = {
  args: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'asdfasdf'
      },

      {
        in: 'path',
        name: 'path2',
        type: 'dddd'
      }
    ]
  },

  request: {
    path: '/5/6.35',
    params: {
      path1: '5',
      path2: '6.35'
    },
    headers: null
  },

  headers: null,

  params: {
    path1: '5',
    path2: '6.35'
  },

  query: null
};
