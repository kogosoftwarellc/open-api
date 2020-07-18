var app = require('express')();
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.get('/foo', function (req, res, next) {
  next(new Error('hello from /foo'));
});

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  paths: path.resolve(__dirname, 'api-routes'),
  exposeApiDocs: false,
  errorMiddleware: function (err, req, res, next) {
    res.status(200).json(err.message);
  },
});

app.use(function (err, req, res, next) {
  res.status(200).json(err.message);
});

module.exports = app;

var port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
