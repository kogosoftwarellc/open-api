module.exports = {
  GET,
};

function GET() {

}
GET.apiDoc = {
  parameters: [
    {
      $ref: '#/parameters/Foo',
    }
  ],

  responses: {
    default: {
      description: 'return foo',
      schema: {}
    }
  }
};
