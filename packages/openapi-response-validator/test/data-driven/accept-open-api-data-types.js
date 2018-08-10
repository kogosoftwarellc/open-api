module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              format: 'int32'
            },
            bar: {
              type: 'string',
              format: 'password'
            }
          }
        }
      }
    },

    definitions: null,
  },

  inputStatusCode: 200,
  inputResponseBody: {foo: 42, bar: 'swordfish'},

  expectedValidationError: void 0
};
