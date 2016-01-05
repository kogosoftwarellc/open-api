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
        location: 'body',
        message: 'req.body was not present in the request.  Is a body-parser being used?',
        schema: {
          properties: {
            foo: {
              type: 'string'
            }
          },
          required: ['foo']
        }
      }
    ]
  })
};
