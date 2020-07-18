module.exports = {
  PUT,
};

function PUT() {
  return;
}
PUT.apiDoc = {
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'return foo',
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
  },
  tags: ['testing', 'example'],
};
