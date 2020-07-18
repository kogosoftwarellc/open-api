var app;
var expect = require('chai').expect;
var supertest = require('supertest');
const http = require('http');

before(function () {
  app = require('./app.js');
  server = http.createServer(app.callback());
  request = supertest(server);
});

after(() => {
  server.close();
});

it('should be mounted at the top level', function (done) {
  request.get('/api-docs').expect(200, done);
});

it('should set the default basePath', function (done) {
  request
    .get('/api-docs')
    .expect(200)
    .end(function (err, res) {
      expect(res.body.basePath).to.eql('/');
      done(err);
    });
});
