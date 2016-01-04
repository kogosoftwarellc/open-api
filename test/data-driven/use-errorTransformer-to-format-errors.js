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

    schemas: null,

    errorTransformer: function(error) {
      return 'asdf';
    }
  },

  requestMethod: 'get',

  requestBody: null,

  path: '',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      'asdf'
    ]
  })
};
