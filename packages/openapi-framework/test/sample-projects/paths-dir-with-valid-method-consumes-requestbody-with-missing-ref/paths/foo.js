module.exports = {
  PUT,
};

function PUT() {
  return;
}
PUT.apiDoc = {
  requestBody: {
    $ref: '#/components/requestBodies/Bar',
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
