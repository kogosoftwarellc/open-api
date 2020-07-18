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
                nullable: true,
                enum: ['HOME', 'CAR'],
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
      foo: null,
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
