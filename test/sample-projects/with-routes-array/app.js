var app = require('express')();
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  routes: [
    path.resolve(__dirname, 'api-routes1'),
    path.resolve(__dirname, 'api-routes2')
  ]
});

app.use(function(err, req, res, next) {
  console.log(err);
});

module.exports = app;
