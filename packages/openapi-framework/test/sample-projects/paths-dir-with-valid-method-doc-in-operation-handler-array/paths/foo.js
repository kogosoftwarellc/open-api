module.exports = {
  GET: [
    function () {
      return;
    },
    GET,
  ],
};

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
