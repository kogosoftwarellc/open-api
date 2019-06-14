module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Test'
          }
        }
      }
    },
    componentSchemas: {
      Test: {
        properties: {
          obj: {
            type: 'object',
            properties: {
              bar: {
                type: 'string'
              },
              foo: {
                type: 'string',
                readOnly: true
              },
              baz: {
                type: 'object',
                properties: {
                  bar: {
                    type: 'string'
                  },
                  foo: {
                    type: 'string',
                    readOnly: true
                  }
                },
                required: ['bar', 'foo']
              }
            },
            required: ['bar', 'foo']
          },
          baz: {
            type: 'string',
            readOnly: true
          }
        },
        required: ['obj', 'baz']
      }
    }
  },
  request: {
    body: {
      obj: {
        bar: 'asdf'
      }
    },
    headers: {
      'content-type': 'application/json'
    }
  }
};
