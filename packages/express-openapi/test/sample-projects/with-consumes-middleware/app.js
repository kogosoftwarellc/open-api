var app = require('express')();
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');

app.use(cors());

module.exports = async function () {
  await openapi.initialize({
    apiDoc: require('./api-doc.js'),
    app: app,
    paths: path.resolve(__dirname, 'api-routes'),
    consumesMiddleware: {
      'application/json': bodyParser.json(),
      'text/text': bodyParser.text(),
    },
  });

  return app;
};

var port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
