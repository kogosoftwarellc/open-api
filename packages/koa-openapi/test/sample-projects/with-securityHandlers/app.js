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
    if (e.challenge) {
      ctx.set('www-authenticate', e.challenge);
    }
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
  docsPath: '/foo-docs',
  paths: path.resolve(__dirname, 'api-routes'),
  securityHandlers: {
    booAuth: async function (ctx) {
      ctx.state.boo = 'boo';
      return true;
    },
    boo2Auth: async function (ctx) {
      ctx.state.boo2 = 'boo2';
      return true;
    },
    failAuth: async function (_ctx) {
      throw {
        status: 401,
        challenge: 'Basic realm=foo',
      };
    },
    fooAuth: async function (ctx) {
      ctx.state.foo = 'foo';
      return true;
    },
  },
});

app.use(router.routes());
module.exports = app;
