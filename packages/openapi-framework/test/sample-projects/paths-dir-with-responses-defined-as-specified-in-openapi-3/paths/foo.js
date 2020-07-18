module.exports = {
  GET,
};

function GET() {
  return;
}

GET.apiDoc = {
  responses: {
    default: {
      $ref: '#/components/responses/Error',
    },
  },
  tags: ['testing', 'example'],
};
