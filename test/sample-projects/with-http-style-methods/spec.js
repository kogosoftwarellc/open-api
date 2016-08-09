var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

it('should allow DELETE', function(done) {
  request(app)
    .delete('/v3/users')
    .expect(204, '', done);
});

it('should allow GET', function(done) {
  request(app)
    .get('/v3/users')
    .expect(200, 'GET', done);
});

it('should allow POST', function(done) {
  request(app)
    .post('/v3/users')
    .send('')
    .expect(200, 'POST', done);
});
