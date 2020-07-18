module.exports = {
  GET,
};

function GET() {
  return;
}
GET.apiDoc = {
  responses: {
    default: {
      description: 'return foo',
      schema: {},
    },
  },
  tags: ['pets', 'testing', 'example', 'examples'],
};
