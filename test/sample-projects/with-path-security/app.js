var app = require('express')();
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  pathSecurity: [
    [/^\/fa/, [{auth1: []}]],
    [/^\/fo/, [{auth2: []}]],
    [/^\/q/, [{booAuth: []}]]
  ],
  paths: path.resolve(__dirname, 'api-routes'),
  securityHandlers: {
    auth1: function(req, scopes, definition, cb) {
      cb({
        status: 401,
        message: 'failed auth1',
        challenge: 'Basic realm=foo'
      });
    },
    auth2: function(req, scopes, definition, cb) {
      cb({
        status: 401,
        message: 'failed auth2',
        challenge: 'Basic realm=foo'
      });
    }
  }
});

app.use(function(err, req, res, next) {
  console.log(err);
});

module.exports = app;
