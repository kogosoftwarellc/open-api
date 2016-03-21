module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          type: 'array'
        }
      }
    ]
  },

  requestMethod: 'post',

  requestBody: {},

  path: '',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      {
        errorCode: 'type.openapi.validation',
        message: 'instance is not of a type(s) array',
        location: 'body'
      }
    ]
  })
};
