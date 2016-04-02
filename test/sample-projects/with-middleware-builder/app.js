var app = require('express')();
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');

app.use(bodyParser.json());

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  routes: path.resolve(__dirname, 'api-routes'),
  middlewareBuilder: function (middleware, methodDoc, apiDoc) {
    // Add a middleware before express-openapi middleware.
    middleware.unshift(function (req, res, next) {
      req.query.baz = 'woo';
      next();
    });

    // Add middleware according to methodDoc or apiDoc
    if (methodDoc.security && methodDoc.security[0]['api-key']) {
      // Add a middleware after express-openapi middleware.
      middleware.push(function (req, res, next) {
        // e.g. security middleware
        if (req.header('x-api-key') === 'my-api-key') {
          return next();
        }
        next({status: 401, message: 'unauthorized'});
      });
    }
  }
});

app.use(function(err, req, res, next) {
  res.status(err.status).json(err);
});

module.exports = app;
