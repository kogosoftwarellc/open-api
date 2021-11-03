module.exports = {
  get: function get(ctx) {
    ctx.status = 200;
    ctx.body = ctx.request.foo;
  },
};

module.exports.get.apiDoc = {
  description: 'Get fail.',
  operationId: 'getFail',
  parameters: [
    {
      name: 'name',
      in: 'query',
      type: 'string',
      required: true,
      description: 'just a mandatory field',
    },
  ],
  security: [
    {
      failAuth: [],
    },
  ],
  responses: {
    204: { description: 'testing security' },
  },
};
