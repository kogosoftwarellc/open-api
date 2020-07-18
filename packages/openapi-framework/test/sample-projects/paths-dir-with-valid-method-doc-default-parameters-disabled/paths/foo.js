module.exports = {
  'x-some-framework-disable-defaults-middleware': true,
  parameters: [
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
      default: 'elvis',
    },
  ],
  responses: {
    default: {
      description: 'return foo',
      schema: {},
    },
  },
};
