var app;
var server;
var request = require('supertest');

before(function() {
  app = require('./app.js');
  server = app.listen(8080);
});

after(() => {
  server.close();
});

module.exports = () => request(server);
