module.exports = {
  parameters: [
    {
      name: 'name',
      in: 'query',
      type: 'string',
    },

    {
      name: 'height',
      in: 'query',
      type: 'string',
    },
  ],
  GET,
};

function GET() {
  return;
}

GET.apiDoc = {
  parameters: [
    {
      name: 'name',
      in: 'query',
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
