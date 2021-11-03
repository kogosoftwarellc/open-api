module.exports = {
  get: function get(ctx) {
    ctx.status = 200;
    ctx.body = ctx.state.foo;
  },
};

module.exports.get.apiDoc = {
  description: 'Get foo.',
  operationId: 'getFoo',
  parameters: [],
  security: [
    {
      fooAuth: [],
    },
  ],
  responses: {
    204: { description: 'testing security' },
  },
};
