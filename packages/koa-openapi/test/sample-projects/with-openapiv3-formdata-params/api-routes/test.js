'use strict';

module.exports = {
  post: function (ctx) {
    ctx.status = 200;
    ctx.body = ctx.request.body;
  },
};
