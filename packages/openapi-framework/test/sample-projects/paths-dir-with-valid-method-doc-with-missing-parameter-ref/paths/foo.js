module.exports = {
  GET,
};

function GET() {

}
GET.apiDoc = {
  parameters: [
    {
      $ref: 'Foo'
    }
  ],

  responses: {
    default: {
      description: 'return foo',
      schema: {}
    }
  }
};
