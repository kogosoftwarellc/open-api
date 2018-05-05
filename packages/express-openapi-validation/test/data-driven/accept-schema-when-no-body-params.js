module.exports = {
  validateArgs: {
    parameters: [],

    schemas: {
      Test1: {
        properties: {
          foo: {
            type: 'string'
          }
        },
        required: ['foo']
      },

      Test2: {
        properties: {
          boo: {
            type: 'string'
          }
        },
        required: ['boo']
      }
    }
  },

  requestMethod: 'post',

  requestBody: {
    test1: {
      foo: 'asdf'
    },
    test2: {
      boo: 'ccccc'
    }
  },

  path: '',

  statusCode: 200,

  responseBody: '"woot"'
};
