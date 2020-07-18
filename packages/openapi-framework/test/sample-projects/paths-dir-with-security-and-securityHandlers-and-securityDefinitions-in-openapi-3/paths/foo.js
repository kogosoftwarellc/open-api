module.exports = {
  GET,
};

function GET() {
  return;
}
GET.apiDoc = {
  responses: {
    '200': {
      description: 'return foo',
      content: {
        'text/plain': {
          schema: {
            type: 'string',
          },
        },
      },
    },
  },
};
