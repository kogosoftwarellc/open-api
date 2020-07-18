module.exports = function () {
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
