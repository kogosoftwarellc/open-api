var express = require('express');
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');

var parentApp = express();
var app = express();
parentApp.use(cors());
parentApp.use(bodyParser.json());

parentApp.use('/api', app);
openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  routes: path.resolve(__dirname, 'api-routes')
});

parentApp.use(function(err, req, res, next) {
  res.status(err.status).json(err);
});

module.exports = parentApp;

var port = parseInt(process.argv[2]);
if (port) {
  parentApp.listen(port);
}
