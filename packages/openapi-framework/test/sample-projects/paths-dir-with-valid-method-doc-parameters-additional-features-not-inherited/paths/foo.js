module.exports = {
  'x-some-framework-additional-middleware': [
    function () {
      return;
    },
  ],
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
  'x-some-framework-inherit-additional-middleware': false,
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
