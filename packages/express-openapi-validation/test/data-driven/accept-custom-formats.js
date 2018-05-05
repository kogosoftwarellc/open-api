module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
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

  path: '?foo=foo',

  statusCode: 200,

  responseBody: '"woot"'
};
