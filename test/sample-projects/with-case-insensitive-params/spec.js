var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

it('should support case insensitive params', function(done) {
  request(app)
    .get('/v1/testParam?testparam=5&testParam1=6')
    .expect(200, '56', done);
});

it('should not affect params that should not be case sensitive', function(done) {
  request(app)
    .get('/v1/testParam?testparam=5&testparam1=6')
    .expect(400, done);
});
