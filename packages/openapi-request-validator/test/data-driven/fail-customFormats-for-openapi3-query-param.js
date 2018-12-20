module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        schema: {
          type: 'string',
          format: 'foo'
        },
        required: true
      }
    ],
    schemas: null,
    customFormats: {
      foo: function(input) {
        return input === 'foo';
      }
    }
  },
  request: {
    path: '?foo=boo',
    query: {
      foo: 'boo'
    }
  },
  expectedError: {
    status: 400,
    errors: [
      {
        path: 'foo',
        errorCode: 'format.openapi.validation',
        message: 'should match format "foo"',
        location: 'query'
      }
    ]
  }
};
