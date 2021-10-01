const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');
// normally you'd just do require('express-openapi'), but this is for test purposes.
const openapi = require('../../../');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

openapi.initialize({
  apiDoc: fs.readFileSync(path.resolve(__dirname, 'api-doc.yml'), 'utf8'),
  app: app,
  paths: path.resolve(__dirname, 'api-routes'),
  operations: {
    getUser: [
      function (req, res, next) {
        req.valueFromMiddleware = 'bar';
        next();
      },
      function get(req, res) {
        res.status(200).json({
          id: req.params.id,
          name: req.query.name,
          age: req.query.age,
          valueFromMiddleware: req.valueFromMiddleware,
        });
      },
    ],
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
