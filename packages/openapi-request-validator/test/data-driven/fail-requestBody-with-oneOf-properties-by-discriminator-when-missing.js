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
      'my_type': 'test1'
    },
    headers: {
      'content-type': 'application/json',
    },
  },

  expectedError: {
    status: 400,
    errors: [
      {
        errorCode: 'required.openapi.requestValidation',
        location: 'body',
        message: "must have required property 'test1_prop'",
        path: 'test1_prop'
      },
      {
        errorCode: 'enum.openapi.requestValidation',
        location: 'body',
        message: 'must be equal to one of the allowed values',
        path: 'my_type'
      },
      {
        errorCode: 'oneOf.openapi.requestValidation',
        message: 'must match exactly one schema in oneOf',
        location: 'body',
      },
    ],
  },
}
