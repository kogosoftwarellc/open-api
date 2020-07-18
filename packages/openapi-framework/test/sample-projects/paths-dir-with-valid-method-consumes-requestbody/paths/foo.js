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
        schema: {},
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
