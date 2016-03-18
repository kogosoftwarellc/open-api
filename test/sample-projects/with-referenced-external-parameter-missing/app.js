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
  referencedJSONs: {
    'http://example.com/foo': {
      parameters: {
        Boo: {
          in: 'query',
          type: 'string',
          name: 'boo',
          required: true
        },
        Foo: {
          in: 'query',
          type: 'string',
          name: 'foo',
          required: true,
          enum: [
            'success',
            'error'
          ]
        }
      },
      responses: {
        SuccessResponse: {
          description: 'A successful response.',
          schema: {
            type: 'string',
            enum: ['success']
          }
        }
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
