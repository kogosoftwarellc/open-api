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
                oneOf: [{ type: 'string' }, { type: 'boolean' }],
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
