module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'string'
      }
    ],

    schemas: null
  },

  requestMethod: 'get',

  requestBody: null,

  path: '/s',

  statusCode: 200,

  responseBody: '"woot"'
};
