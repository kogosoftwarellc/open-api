'use strict';
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const path = require('path');
const openapi = require('../../../');
const fs = require('fs');

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
  apiDoc: fs.readFileSync(path.resolve(__dirname, 'api-doc.yml'), 'utf8'),
  router,
  paths: path.resolve(__dirname, 'api-routes'),
});

app.use(router.routes());
module.exports = app;
