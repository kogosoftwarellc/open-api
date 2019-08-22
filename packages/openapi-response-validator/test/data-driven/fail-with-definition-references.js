module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              $ref: '#/definitions/foo'
            }
          }
        }
      }
    },

    definitions: {
      foo: {
        type: 'string'
      }
    }
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 345 },

  expectedValidationError: [
    {
      path: 'foo',
      errorCode: 'type.openapi.responseValidation',
      message: 'foo should be string'
    }
  ]
};
