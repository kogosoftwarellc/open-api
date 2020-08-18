module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              foo: {
                nullable: true,
                anyOf: [{ type: 'string' }, { type: 'boolean' }],
              },
            },
          },
        },
      },
    },
  },
  request: {
    body: {
      foo: null,
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
