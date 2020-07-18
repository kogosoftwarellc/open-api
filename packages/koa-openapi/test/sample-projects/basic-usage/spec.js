var app;
var server;
var request = require('supertest');

before(function (done) {
  this.timeout(4000);
  app = require('./app.js');
  server = app.listen(8080);
  setTimeout(done, 200); // give the server some time
});

after(() => {
  server.close();
});

module.exports = () => request(server);
