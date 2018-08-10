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
  'x-some-framework-inherit-additional-middleware': false,
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
