module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'header',
        name: 'X-yoda',
        type: 'string'
      }
    ],

    schemas: null
  },

  requestMethod: 'get',

  requestBody: null,

  headers: null,

  path: '',

  statusCode: 200,

  responseBody: '"woot"'
};
