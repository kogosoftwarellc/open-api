module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        required: true,
      },
    ],
    schemas: null,
    errorTransformer: function (openApiError, jsonSchemaError) {
      return arguments.length;
    },
  },
  request: {},
  expectedError: {
    status: 400,
    errors: [2],
  },
};
