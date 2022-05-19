var app;
var expect = require('chai').expect;
var request = require('supertest');

before(async function () {
  app = await require('./app.js')();
});

it('should be mounted at the top level', function (done) {
  request(app).get('/foo-docs').expect(200, done);
});

it('should set the default basePath', function (done) {
  request(app)
    .get('/foo-docs')
    .expect(200)
    .end(function (err, res) {
      expect(res.body.basePath).to.eql('/');
      done(err);
    });
});
