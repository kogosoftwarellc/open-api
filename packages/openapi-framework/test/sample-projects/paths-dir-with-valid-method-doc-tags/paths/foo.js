module.exports = {
  GET,
};

function GET() {

}
GET.apiDoc = {
  responses: {
    default: {
      description: 'return foo',
      schema: {}
    }
  },
  tags: [ 'pets', 'testing', 'example', 'examples' ],
};
