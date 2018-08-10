module.exports = {
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
  'x-some-framework-disable-coercion-middleware': true,
  'x-some-framework-disable-response-validation-middleware': true,
  'x-some-framework-disable-validation-middleware': true,
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
