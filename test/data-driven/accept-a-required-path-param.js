module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'string',
        required: true
      }
    ],

    schemas: null
  },

  requestMethod: 'get',

  requestBody: null,

  path: '/foo/asdf',

  statusCode: 200,

  responseBody: '"woot"'
};
