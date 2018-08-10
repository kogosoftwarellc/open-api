module.exports = {
  PUT,
};

function PUT() {

}
PUT.apiDoc = {
  consumes: [ 'application/json' ],
  responses: {
    default: {
      description: 'return foo',
      schema: {}
    }
  },
  tags: [ 'testing', 'example' ],
};
