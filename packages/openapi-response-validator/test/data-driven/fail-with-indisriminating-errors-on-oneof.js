module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          oneOf: [
            {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                },
                my_type: {
                  type: 'string',
                  enum: ['foo']
                }
              },
              required: ['foo', 'my_type'],
            },
            {

              type: 'object',
              properties: {
                bar: {
                  type: 'string',
                },
                my_type: {
                  type: 'string',
                  enum: ['bar']
                }
              },
              required: ['bar', 'my_type'],
            }
          ],
          discriminator: {
            propertyName: 'my_type'
          }
        }
      }
    }
  },
  inputStatusCode: 200,
  inputResponseBody: {
    my_type: 'foo',
  },
  expectedValidationError: {
    message: 'The response was not valid.',
    errors:[
      {
        errorCode: 'required.openapi.responseValidation',
        message: "must have required property 'foo'",
        path: 'response'
      },
      {
        errorCode: 'required.openapi.responseValidation',
        message: "must have required property 'bar'",
        path: 'response'
      },
      {
        errorCode: 'enum.openapi.responseValidation',
        message: 'must be equal to one of the allowed values',
        path: 'my_type'
      },
      {
        errorCode: 'oneOf.openapi.responseValidation',
        message: 'must match exactly one schema in oneOf',
        path: 'response'
      }
    ]
  }
}
