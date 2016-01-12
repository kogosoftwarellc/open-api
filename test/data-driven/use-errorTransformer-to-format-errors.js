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

    errorTransformer: function(openApiError, jsonSchemaError) {
      return arguments.length;
    }
  },

  requestMethod: 'get',

  requestBody: null,

  path: '',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      2
    ]
  })
};
