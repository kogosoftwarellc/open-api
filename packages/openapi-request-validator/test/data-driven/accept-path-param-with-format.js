module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'path',
        name: 'path2',
        type: 'string',
        format: 'uuid',
      },
    ],
    schemas: null,
  },
  request: {
    path: '/foo/0210a341-d7f9-4d5f-80e5-db5e8143ea12',
    params: {
      path1: 'foo',
      path2: '0210a341-d7f9-4d5f-80e5-db5e8143ea12',
    },
  },
};
