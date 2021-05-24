var app = require('express')();
var bodyParser = require('body-parser');
// normally you'd just do require('express-openapi'), but this is for test purposes.
var openapi = require('../../../');
var path = require('path');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

openapi.initialize({
  apiDoc: require('./api-doc.js'),
  app: app,
  paths: path.resolve(__dirname, 'api-routes'),
  customKeywords: {
    'x-coerce': {
      modifying: true,
      errors: false,
      validate: function (keywordData, data, parentSchema, dataCtx) {
        if (keywordData === 'Date') {
          const date = new Date(parseInt(data, 10));
          if (isNaN(date.getTime())) {
            return false;
          }
          dataCtx.parentData[dataCtx.parentDataProperty] = date;
        }
        return true;
      },
    },
  },
});

app.use(function (err, req, res, next) {
  res.status(err.status).json(err);
});

module.exports = app;

const port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
