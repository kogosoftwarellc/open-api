module.exports = {
  validateArgs: {
    requestBody: {
      description: 'oneOf with discriminator',
      content: {
        'application/json; charset=utf-8': {
          schema: {
            discriminator: 'my_type',
            oneOf: [
              {
                $ref: '#/components/schemas/Test1',
              },
              {
                $ref: "#/components/schemas/Test2"
              },
            ]
          }
        }
      }
    },
    componentSchemas: {
      Test1: {
        properties: {
          test1_prop: {
            type: 'string'
          },
          my_type: {
            type: 'string',
            enum: ['test1']
          }
        },
        required: ['my_type', 'test1_prop']
      },
      Test2: {
        properties: {
          test2_prop: {
            type: 'string'
          },
          my_type: {
            type: 'string',
            enum: ['test2']
          }
        },
        required: ['my_type']
      }
    }
  },
  request: {
    body: {
      'my_type': 'test1',
      'test1_prop': 'something'
    },
    headers: {
      'content-type': 'application/json',
    },
  },
}
