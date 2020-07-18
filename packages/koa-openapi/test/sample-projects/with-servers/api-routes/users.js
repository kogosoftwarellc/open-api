module.exports = {
  get: function get(ctx) {
    ctx.status = 200;
    ctx.body = {
      id: ctx.params.id,
      name: ctx.query.name,
      age: ctx.query.age,
    };
  },
};
