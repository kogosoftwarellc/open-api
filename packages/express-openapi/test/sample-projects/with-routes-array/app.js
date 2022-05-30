var app = require('express')();
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');

module.exports = async function () {
  await openapi.initialize({
    apiDoc: require('./api-doc.js'),
    app: app,
    paths: [
      path.resolve(__dirname, 'api-routes1'),
      path.resolve(__dirname, 'api-routes2'),
    ],
  });

  app.use(function (err, req, res, next) {
    console.log(err);
  });
  
  return app
};
