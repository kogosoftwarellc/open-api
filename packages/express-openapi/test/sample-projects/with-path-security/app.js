var app = require('express')();
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');

module.exports = async function () {
  await openapi.initialize({
    apiDoc: require('./api-doc.js'),
    app: app,
    pathSecurity: [
      [/^\/fa/, [{ auth1: [] }]],
      [/^\/fo/, [{ auth2: [] }]],
      [/^\/q/, [{ booAuth: [] }]],
    ],
    paths: path.resolve(__dirname, 'api-routes'),
    securityHandlers: {
      auth1: function (req, scopes, definition) {
        throw {
          status: 401,
          message: 'failed auth1',
          challenge: 'Basic realm=foo',
        };
      },
      auth2: function (req, scopes, definition) {
        throw {
          status: 401,
          message: 'failed auth2',
          challenge: 'Basic realm=foo',
        };
      },
    },
  });

  app.use(function (err, req, res, next) {
    if (err.challenge) {
      res.set('www-authenticate', err.challenge);
    }
    res.status(err.status || 500);
  
    if (typeof err.message === 'string') {
      res.send(err.message);
    } else {
      res.json(err.message);
    }
  });
  
  return app
};
