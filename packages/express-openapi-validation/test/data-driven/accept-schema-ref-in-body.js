module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          $ref: '#/definitions/Test1'
        }
      }
    ],

    schemas: {
      Test1: {
        properties: {
          foo: {
            type: 'string'
          }
        },
        required: ['foo']
      }
    }
  },

  requestMethod: 'post',

  requestBody: {
    foo: 'asdf'
  },

  path: '',

  statusCode: 200,

  responseBody: '"woot"'
};
