var app;
var expect = require('chai').expect;
var request = require('supertest');

describe('when an error occurs in the basePath', function () {
  before(async function () {
    app = await require('./app.js')();
  });

  it('should use the API error middleware', function (done) {
    request(app).get('/v3/foo').expect(200, '"hello from /v3/foo"', done);
  });
});

describe('when an error occurs outside the basePath', function () {
  before(async function () {
    app = await require('./app.js')();
  });

  it('should not use the API error middleware', function (done) {
    request(app).get('/foo').expect(200, '"hello from /foo"', done);
  });
});
