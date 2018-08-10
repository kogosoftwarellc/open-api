module.exports = {
  'x-some-framework-additional-middleware': [
    function() {}
  ],
  parameters: [
    {
      name: 'height',
      in: 'query',
      type: 'string'
    }
  ],
  GET,
};

function GET() {

}

GET.apiDoc = {
  parameters: [
    {
      name: 'name',
      in: 'query',
      type: 'string'
    }
  ],
  responses: {
    default: {
      description: 'return foo',
      schema: {}
    }
  }
};
