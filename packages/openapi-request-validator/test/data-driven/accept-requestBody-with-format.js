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
                format: 'uuid',
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
      foo: '0210a341-d7f9-4d5f-80e5-db5e8143ea12',
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
