module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        required: true,
        format: 'foo',
      },
    ],
    schemas: null,
    customFormats: {
      foo: function (input) {
        return input === 'foo';
      },
    },
  },
  request: {
    path: '?foo=boo',
    query: {
      foo: 'boo',
    },
  },
  expectedError: {
    status: 400,
    errors: [
      {
        path: 'foo',
        errorCode: 'format.openapi.requestValidation',
        message: 'must match format "foo"',
        location: 'query',
      },
    ],
  },
};
