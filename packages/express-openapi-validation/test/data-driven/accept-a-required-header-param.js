module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'header',
        name: 'X-foO',
        type: 'string',
        required: true
      }
    ],

    schemas: null
  },

  requestMethod: 'get',

  requestBody: null,

  headers: {
    'x-foo': 'asdf'
  },

  path: '',

  statusCode: 200,

  responseBody: '"woot"'
};
