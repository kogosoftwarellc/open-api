module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              format: 'foo'
            }
          }
        }
      }
    },

    definitions: null,

    customFormats: {
      foo: function(input) {
        return input === 'foo';
      }
    }
  },

  inputStatusCode: 200,
  inputResponseBody: {foo: 2345},

  expectedValidationError: {
    status: 500,
    message: 'The response was not valid.',
    errors: [
      {
        path: 'foo',
        errorCode: 'type.openapi.responseValidation',
        message: 'foo is not of a type(s) string'
      },
      {
        errorCode: 'format.openapi.responseValidation',
        message: 'foo does not conform to the "foo" format',
        path: 'foo'
      }
    ]
  }
};
