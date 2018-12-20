var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

it('should transform errors', function(done) {
  request(app)
    .get('/v3/users/34?name=barney')
    .expect(400, { errors: [{ fooError: 'oh yea' }], status: 400 }, done);
});
