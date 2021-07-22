module.exports = {
  GET,
};

function GET() {
  return;
}
GET.apiDoc = {
  parameters: [
    {
      format: 'foo',
      in: 'query',
      name: 'foo',
      type: 'string',
    },
  ],
  responses: {
    default: {
      description: 'return foo',
      schema: {},
    },
  },
};
