module.exports = function(myService) {
  function GET() {

  }

  GET.apiDoc = {
    responses: {
      default: {
        description: 'return foo',
        schema: {}
      }
    }
  };

  return {
    GET,
  };
};
