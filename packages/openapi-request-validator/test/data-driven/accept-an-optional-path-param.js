module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'string',
      },
    ],
    schemas: null,
  },
  request: {
    path: '/s',
    params: {
      path1: 's',
    },
  },
};
