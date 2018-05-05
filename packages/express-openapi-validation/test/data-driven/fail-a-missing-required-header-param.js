module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'header',
        name: 'foo',
        type: 'string',
        required: true
      }
    ],

    schemas: null
  },

  requestMethod: 'get',

  requestBody: null,

  headers: null,

  path: '',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      {
        path: 'foo',
        errorCode: 'required.openapi.validation',
        message: 'instance requires property "foo"',
        location: 'headers'
      }
    ]
  })
};
