module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        required: true
      }
    ],

    definitions: null
  },

  requestMethod: 'get',

  requestBody: null,

  path: '?foo=asdf',

  statusCode: 200,

  responseBody: '"woot"'
};
