module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'formData',
        name: 'foo',
        type: 'string',
        required: true
      }
    ]
  },

  disableBodyParser: true,

  requestMethod: 'post',

  requestBody: {},

  path: '',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      {
        path: 'foo',
        errorCode: 'required.openapi.validation',
        message: 'instance requires property "foo"',
        location: 'formData'
      }
    ]
  })
};
