var app = require('express')();
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');
var multer = require('multer');

app.use(cors());

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  paths: path.resolve(__dirname, 'api-routes'),
  consumesMiddleware: {
    'multipart/form-data': function (req, res, next) {
      multer().any()(req, res, function (err) {
        if (err) {
          return next(err);
        }
        // Handle both single and multiple files
        const filesMap = req.files.reduce(
          (acc, f) =>
            Object.assign(acc, {
              [f.fieldname]: (acc[f.fieldname] || []).concat(f),
            }),
          {}
        );
        Object.keys(filesMap).forEach((fieldname) => {
          const files = filesMap[fieldname];
          req.body[fieldname] = files.length > 1 ? files.map(() => '') : '';
        });
        return next();
      });
    },
  },
});

module.exports = app;

var port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
