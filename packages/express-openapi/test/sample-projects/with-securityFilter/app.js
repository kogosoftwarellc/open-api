var app = require('express')();
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

openapi.initialize({
  apiDoc: require('./api-doc'),
  app: app,
  paths: path.resolve(__dirname, 'api-routes'),
  securityFilter: function (req, res, next) {
    if (req.headers.authorization !== 'Basic foo') {
      return next({
        message: 'not authenticated to view api docs',
        status: 400,
      });
    }
    res.status(200).json(req.apiDoc);
  },
});

app.use(function (err, req, res, next) {
  res.status(err.status).json(err.message);
});

module.exports = app;

var port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
