var Koa = require('koa');
var app = new Koa();
var Router = require('koa-router');
var router = new Router();
var bodyParser = require('koa-bodyparser');
var path = require('path');
var openapi = require('../../../');

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.status = e.status;
    if (e.errors) {
      ctx.body = {
        status: e.status || 500,
        errors: e.errors,
      };
    }
  }
});

app.use(bodyParser());

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  router,
  paths: path.resolve(__dirname, 'api-routes'),
});

app.use(router.routes());
module.exports = app;
