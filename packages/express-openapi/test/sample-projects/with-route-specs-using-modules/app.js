var app = require('express')();
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

var paths = [
  { path: '/apiDocs', module: require('./api-routes/apiDocs') },
  { path: '/users', module: require('./api-routes/users') },
  { path: '/users/{id}', module: require('./api-routes/users/{id}') },
];

module.exports = async function () {
  await openapi.initialize({
    apiDoc: require('./api-doc.js'),
    app: app,
    paths: paths,
  });

  app.use(function (err, req, res, next) {
    res.status(err.status).json(err);
  });

  return app;
};

var port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
