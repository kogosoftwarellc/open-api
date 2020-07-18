module.exports = {
  GET,
};

function GET() {
  return;
}
GET.apiDoc = {
  parameters: [
    {
      $ref: 'Foo',
    },
  ],

  responses: {
    default: {
      description: 'return foo',
      schema: {},
    },
  },
};
