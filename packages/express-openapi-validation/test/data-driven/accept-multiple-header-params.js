module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'header',
        name: 'X-foO',
        type: 'string',
        required: true
      },

      {
        in: 'header',
        name: 'X-yoda',
        type: 'string',
        required: true
      }
    ],

    schemas: null
  },

  requestMethod: 'get',

  requestBody: null,

  headers: {
    'x-foo': 'asdf',
    'X-Yoda': 'Luke'
  },

  path: '',

  statusCode: 200,

  responseBody: '"woot"'
};
