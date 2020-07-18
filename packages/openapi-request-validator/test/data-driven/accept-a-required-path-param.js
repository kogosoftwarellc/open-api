module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'string',
        required: true,
      },
    ],
    schemas: null,
  },
  request: {
    path: '/foo/asdf',
    params: {
      path1: 'foo',
      path2: 'asdf',
    },
  },
};
