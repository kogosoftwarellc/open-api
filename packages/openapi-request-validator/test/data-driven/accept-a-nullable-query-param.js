module.exports = {
  validateArgs: {
    parameters: [
      {
        in: "query",
        name: "foo",
        type: "string",
        nullable: true
      }
    ],
    schemas: null
  },
  request: {
    path: "?foo=asdf",
    query: {
      foo: null
    }
  }
};
