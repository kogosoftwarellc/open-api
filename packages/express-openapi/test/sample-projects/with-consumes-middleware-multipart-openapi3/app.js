var app = require('express')();
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');
var multer = require('multer');

app.use(cors());

const isBinary = field => field.type === 'string' && field.format === 'binary';
const isArray = field => field.type === 'array';

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  paths: path.resolve(__dirname, 'api-routes'),
  consumesMiddleware: {
    'multipart/form-data': function(req, res, next) {
      const { requestBody } = req.operationDoc;
      if (requestBody && requestBody.content['multipart/form-data']) {
        const { properties } = requestBody.content[
          'multipart/form-data'
        ].schema;

        const fileFieldMap = Object.keys(properties).reduce((acc, prop) => {
          if (isBinary(properties[prop])) {
            acc[prop] = 'single';
          } else if (
            isArray(properties[prop]) &&
            isBinary(properties[prop].items)
          ) {
            acc[prop] = 'array';
          }
          return acc;
        }, {});

        const allFileFields = Object.keys(fileFieldMap);

        let upload;

        if (allFileFields.length) {
          upload = multer().fields(allFileFields.map(name => ({ name })));
        } else {
          upload = multer().none();
        }

        upload(req, res, function(err) {
          if (err) {
            return next(err);
          }

          // Handle both single and multiple files
          allFileFields.forEach(field => {
            if (fileFieldMap[field] === 'single' && req.files[field].length) {
              req.body[field] = '';
            } else if (
              fileFieldMap[field] === 'array' &&
              req.files[field].length
            ) {
              req.body[field] = req.files[field].map(() => '');
            }
          });
          return next();
        });
      } else {
        next();
      }
    }
  }
});

module.exports = app;

var port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
