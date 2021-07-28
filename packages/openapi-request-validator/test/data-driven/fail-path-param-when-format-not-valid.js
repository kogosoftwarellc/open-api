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
    path: '/foo/some-none-uuid',
    params: {
      path1: 'foo',
      path2: 'some-non-uuid',
    },
  },

  expectedError: {
    status: 400,
    errors: [
      {
        errorCode: 'format.openapi.requestValidation',
        message: 'must match format "uuid"',
        location: 'path',
        path: 'path2',
      },
    ],
  },
};
