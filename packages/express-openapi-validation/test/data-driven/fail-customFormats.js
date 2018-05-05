module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        required: true,
        format: 'foo'
      }
    ],

    schemas: null,

    customFormats: {
      foo: function(input) {
        return input === 'foo'
      }
    }
  },

  requestMethod: 'get',

  requestBody: null,

  path: '?foo=boo',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      {
        path: 'foo',
        errorCode: 'format.openapi.validation',
        message: 'instance.foo does not conform to the "foo" format',
        location: 'query'
      }
    ]
  })
};
