module.exports = function() {
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
