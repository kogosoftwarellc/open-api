module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              $ref: 'http://example.com/schema#/definitions/foo'
            }
          }
        }
      }
    },

    definitions: null,

    externalSchemas: {
      'http://example.com/schema': {
        definitions: {
          foo: {
            type: 'string'
          }
        }
      }
    }
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 2345 },

  expectedValidationError: [
    {
      path: 'foo',
      errorCode: 'type.openapi.responseValidation',
      message: 'foo should be string'
    }
  ]
};
