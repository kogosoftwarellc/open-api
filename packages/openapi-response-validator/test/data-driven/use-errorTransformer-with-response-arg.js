module.exports = {
  constructorArgs: {
    responses: {
      200: {
        schema: {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
            },
          },
        },
      },
    },

    definitions: null,

    errorTransformer: function (openapiError, jsonschemaError, response) {
      return `Incorrect type "${typeof response.foo}" for "${openapiError.path}": ${openapiError.message}`;
    },
  },

  inputStatusCode: 200,
  inputResponseBody: { foo: 2345 },

  expectedValidationError: {
    message: 'The response was not valid.',
    errors: ['Incorrect type "number" for "foo": must be string'],
  },
};
