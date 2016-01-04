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

  path: '',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      {
        path: 'foo',
        errorCode: 'required.openapi.validation',
        message: 'instance requires property "foo"'
      }
    ]
  })
};
