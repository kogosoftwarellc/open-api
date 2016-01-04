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
    ],

    schemas: [
      {
        id: '#/definitions/TestBody',
        properties: {
          foo: {
            type: 'string'
          }
        },
        required: ['foo']
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
        path: 'foo',
        errorCode: 'required.openapi.validation',
        message: 'instance requires property "foo"',
        location: 'body'
      }
    ]
  })
};
