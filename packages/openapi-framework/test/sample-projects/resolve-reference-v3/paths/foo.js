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
          $ref: '#/components/schemas/Document',
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
