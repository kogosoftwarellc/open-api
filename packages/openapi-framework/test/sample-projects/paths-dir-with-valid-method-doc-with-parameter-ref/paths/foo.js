module.exports = {
  GET,
};

function GET() {
  return;
}
GET.apiDoc = {
  parameters: [
    {
      $ref: '#/parameters/Foo',
    },
  ],

  responses: {
    default: {
      description: 'return foo',
      schema: {},
    },
  },
};
