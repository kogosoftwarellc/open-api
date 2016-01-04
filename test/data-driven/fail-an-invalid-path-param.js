module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'string',
        pattern: '^a$',
        required: true
      }
    ],

    schemas: null
  },

  requestMethod: 'get',

  requestBody: null,

  path: '/f',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      {
        path: 'path1',
        errorCode: 'pattern.openapi.validation',
        message: 'instance.path1 does not match pattern "^a$"',
        location: 'path'
      }
    ]
  })
};
