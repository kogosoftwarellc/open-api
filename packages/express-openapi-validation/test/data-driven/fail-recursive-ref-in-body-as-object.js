module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          properties: {
            test1: {
              $ref: '#/definitions/Test1'
            }
          },
          required: ['test1']
        }
      }
    ],

    schemas: {
      Test1: {
        properties: {
          foo: {
            type: 'string'
          },
          recursive: {
            $ref: '#/definitions/Test1'
          }
        },
        required: ['foo']
      }
    }
  },

  requestMethod: 'post',

  requestBody: {
    test1: {
      foo: 'asdf',
      recursive: {
        foo: 5
      }
    }
  },

  path: '',

  statusCode: 400,

  responseBody: {
    status: 400,
    errors: [
      {
        path: 'test1.recursive.foo',
        errorCode: 'type.openapi.validation',
        message: 'instance.test1.recursive.foo is not of a type(s) string',
        location: 'body'
      }
    ]
  }
};
