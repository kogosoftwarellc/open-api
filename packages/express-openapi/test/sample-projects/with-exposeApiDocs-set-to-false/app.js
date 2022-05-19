var app = require('express')();
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');

app.use(bodyParser.json());

app.use(function (err, req, res, next) {
  res.status(err.status).json(err);
});

module.exports = async function () {
  await openapi.initialize({
    apiDoc: require('./api-doc.js'),
    app: app,
    exposeApiDocs: false,
    paths: path.resolve(__dirname, 'api-routes'),
  });

  return app
};
