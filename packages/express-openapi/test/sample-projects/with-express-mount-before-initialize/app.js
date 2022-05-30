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

module.exports = async function () {
  await openapi.initialize({
    apiDoc: require('./api-doc.js'),
    app: app,
    paths: path.resolve(__dirname, 'api-routes'),
  });

  parentApp.use('/api', app);

  parentApp.use(function (err, req, res, next) {
    res.status(err.status).json(err);
  });

  return parentApp
};

var port = parseInt(process.argv[2], 10);
if (port) {
  parentApp.listen(port);
}
