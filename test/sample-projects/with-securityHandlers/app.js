var app = require('express')();
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  paths: path.resolve(__dirname, 'api-routes'),
  securityHandlers: {
    booAuth: function(req, scopes, definition, cb) {
      req.boo = 'boo';
      cb(null, true);
    },
    boo2Auth: function(req, scopes, definition, cb) {
      req.boo2 = 'boo2';
      cb(null, true);
    },
    failAuth: function(req, scopes, definition, cb) {
      cb({
        status: 401,
        challenge: 'Basic realm=foo'
      });
    },
    fooAuth: function(req, scopes, definition, cb) {
      req.foo = 'foo';
      cb(null, true);
    }
  }
});

app.use(function(err, req, res, next) {
  console.log(err);
});

module.exports = app;
