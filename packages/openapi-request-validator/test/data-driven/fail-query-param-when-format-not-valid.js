module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        format: 'uuid',
        required: true,
      },
    ],
    schemas: null,
  },
  request: {
    path: '?foo=some-non-uuid',
    query: {
      foo: 'some-non-uuid',
    },
  },

  expectedError: {
    status: 400,
    errors: [
      {
        errorCode: 'format.openapi.requestValidation',
        message: 'must match format "uuid"',
        location: 'query',
        path: 'foo',
      },
    ],
  },
};
