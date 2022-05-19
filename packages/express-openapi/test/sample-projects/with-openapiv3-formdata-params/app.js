const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');
// normally you'd just do require('express-openapi'), but this is for test purposes.
const openapi = require('../../../');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (err, req, res, next) {
  res.status(err.status).json(err);
});

module.exports = async function () {
  await openapi.initialize({
    apiDoc: fs.readFileSync(path.resolve(__dirname, 'api-doc.yml'), 'utf8'),
    app: app,
    paths: path.resolve(__dirname, 'api-routes'),
  });
  
  return app
};

const port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
