module.exports = {
  get: function get(ctx) {
    ctx.status = 200;
    ctx.body = ctx.state.boo + ctx.state.boo2;
  },
};

module.exports.get.apiDoc = {
  description: 'Get boo.',
  operationId: 'getBoo',
  parameters: [],
  responses: {
    204: { description: 'testing security' },
  },
};
