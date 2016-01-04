module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string'
      }
    ],

    schemas: null
  },

  requestMethod: 'get',

  requestBody: null,

  path: '',

  statusCode: 200,

  responseBody: '"woot"'
};
