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

  requestMethod: 'post',

  requestBody: {},

  path: '',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      {
        message: 'no such schema #/definitions/TestBody located in </>',
        schema: {
          $ref: '#/definitions/TestBody'
        },
        location: 'body'
      }
    ]
  })
};
