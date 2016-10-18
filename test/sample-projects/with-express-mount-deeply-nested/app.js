var express = require('express');
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');

var grandparentApp = express();
var parentApp = express();
var app = express();
grandparentApp.use(cors());
grandparentApp.use(bodyParser.json());

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  paths: path.resolve(__dirname, 'api-routes')
});

parentApp.use(function(err, req, res, next) {
  res.status(err.status).json(err);
});


parentApp.use('/parent', app);
grandparentApp.use('/grandparent', parentApp);

module.exports = grandparentApp;

var port = parseInt(process.argv[2]);
if (port) {
  parentApp.listen(port);
}
