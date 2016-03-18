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
  routes: path.resolve(__dirname, 'api-routes'),
  externalSchemas: {
    'http://example.com/error':{
      description: 'An error occurred.',
      schema: {
        type: 'string',
        enum: ['error']
      }
    },
    'http://example.com/user': {
      description: 'User schema definition',
      required: ['name'],
      properties: {
        name: { type: "string" },
        age: { type: "integer", format: 'int32'}
      }
    },
    'http://example.com/tea-pod': {
      description: 'Tea pod schema definition',
      required: ['content'],
      properties: {
        content: { description: 'content in litter', type: "integer" }
      }
    }
  }
});

app.use(function(err, req, res, next) {
  res.status(err.status).json(err);
});

module.exports = app;

var port = parseInt(process.argv[2]);
if (port) {
  app.listen(port);
}
