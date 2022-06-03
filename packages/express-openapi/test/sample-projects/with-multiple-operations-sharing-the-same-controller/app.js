var app = require('express')();
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

//shared controller
function controller(req, res, next) {
  return res.json(req.operationDoc);
}

module.exports = async function () {
  await openapi.initialize({
    apiDoc: require('./api-doc.json'),
    app: app,
    promiseMode: true,
    operations: {
      getFoo: controller,
      getFooTwo: controller,
    },
  });

  app.use(function (err, req, res, next) {
    res.status(err.status).json(err.message);
  });

  return app;
};

var port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
