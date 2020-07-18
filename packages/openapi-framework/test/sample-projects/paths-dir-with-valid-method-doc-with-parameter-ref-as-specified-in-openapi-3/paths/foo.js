module.exports = {
  GET,
};

function GET() {
  return;
}

GET.apiDoc = {
  parameters: [
    {
      $ref: '#/components/parameters/Foo',
    },
  ],

  responses: {
    default: {
      description: 'return foo',
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
  },
};
