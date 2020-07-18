var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function () {
  app = require('./app.js');
});

it('should be up ignoring spec files', function (done) {
  request(app).get('/v3/foo').expect(200, done);
});
