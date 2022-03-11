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
    additionalQueryProperties: false,
  },
  request: {
    query: {
      foo: 'asdf',
      additional1: 'bbbbb',
    },
  },
  expectedError: {
    status: 400,
    errors: [
      {
        errorCode: 'additionalProperties.openapi.requestValidation',
        message: 'must NOT have additional properties',
        location: 'query',
      },
    ],
  },
};
