var app;
var expect = require('chai').expect;
var request = require('supertest');

before(async function () {
  app = await require('./app.js')();
});

describe('when an error occurs in the basePath', function () {
  it('should use the API error middleware', function (done) {
    request(app).get('/v3/foo').expect(200, '"hello from /v3/foo"', done);
  });
});

describe('when an error occurs outside the basePath', function () {
  it('should not use the API error middleware', function (done) {
    request(app).get('/foo').expect(200, '"hello from /foo"', done);
  });
});
