var app = require('express')();
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');

module.exports = async function () {
  await openapi.initialize({
    apiDoc: require('./api-doc.js'),
    app: app,
    paths: path.resolve(__dirname, 'api-routes'),
    securityHandlers: {
      booAuth: function (req, scopes, definition) {
        req.boo = 'boo';
        return true;
      },
      boo2Auth: function (req, scopes, definition) {
        req.boo2 = 'boo2';
        return true;
      },
      failAuth: function (req, scopes, definition) {
        throw {
          status: 401,
          challenge: 'Basic realm=foo',
        };
      },
      fooAuth: function (req, scopes, definition) {
        req.foo = 'foo';
        return true;
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

  return app;
};
