module.exports = function (myService) {
  function GET() {
    return;
  }

  GET.apiDoc = {
    responses: {
      default: {
        description: 'return foo',
        schema: {},
      },
    },
  };

  return {
    GET,
  };
};
