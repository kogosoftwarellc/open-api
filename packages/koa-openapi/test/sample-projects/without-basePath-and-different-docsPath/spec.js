const expect = require('chai').expect;
const supertest = require('supertest');
const http = require('http');

let app;
let request;
let server;

before(function () {
  app = require('./app.js');
  server = http.createServer(app.callback());
  request = supertest(server);
});

after(() => {
  server.close();
});

it('should be mounted at the top level', function (done) {
  request.get('/foo-docs').expect(200, done);
});

it('should set the default basePath', function (done) {
  request
    .get('/foo-docs')
    .expect(200)
    .end(function (err, res) {
      expect(res.body.basePath).to.eql('/');
      done(err);
    });
});
