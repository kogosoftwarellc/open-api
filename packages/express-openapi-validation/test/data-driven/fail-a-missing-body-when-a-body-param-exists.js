module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          $ref: '#/definitions/TestBody'
        }
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
          $ref: '#/definitions/TestBody'
        }
      }
    ]
  })
};
