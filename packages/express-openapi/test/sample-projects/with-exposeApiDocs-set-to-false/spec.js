var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function () {
  app = require('./app.js');
});

it('should not expose /api-docs', function (done) {
  request(app).get('/v3/api-docs').expect(404, done);
});
