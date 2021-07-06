module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'query',
        name: 'foo',
        type: 'string',
        format: 'uuid',
        required: true,
      },
    ],
    schemas: null,
  },
  request: {
    path: '?foo=0210a341-d7f9-4d5f-80e5-db5e8143ea12',
    query: {
      foo: '0210a341-d7f9-4d5f-80e5-db5e8143ea12',
    },
  },
};
