module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        schema: {
          properties: {
            test1: {
              $ref: '#/definitions/Test1'
            },
            test2: {
              $ref: '#/definitions/Test2'
            }
          },
          required: ['test1', 'test2']
        }
      }
    ],

    schemas: [
      {
        id: '#/definitions/Test1',
        properties: {
          foo: {
            type: 'string'
          }
        },
        required: ['foo']
      },

      {
        id: '#/definitions/Test2',
        properties: {
          boo: {
            type: 'string'
          }
        },
        required: ['boo']
      }
    ]
  },

  requestMethod: 'post',

  requestBody: null,

  path: '',

  statusCode: 400,

  responseBody: JSON.stringify({
    status: 400,
    errors: [
      {
        path: 'test1',
        errorCode: 'required.openapi.validation',
        message: 'instance requires property "test1"',
        location: 'body'
      },
      {
        path: 'test2',
        errorCode: 'required.openapi.validation',
        message: 'instance requires property "test2"',
        location: 'body'
      }
    ]
  })
};
