module.exports = {
  validateArgs: {
    parameters: [
      {
        in: "path",
        name: "path1",
        type: "string",
        nullable: true
      }
    ],
    schemas: null
  },
  request: {
    path: "/foo/asdf",
    params: {
      path1: null
    }
  }
};
