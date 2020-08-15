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
                allOf: [{ type: 'string' }],
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
