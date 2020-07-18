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
                type: 'string',
              },
            },
          },
        },
      },
    },
    schemas: null,
  },
  request: {
    body: {
      foo: 'asdf',
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
