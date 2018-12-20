var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

it('should expose the first set of routes', function(done) {
  request(app)
    .get('/v3/boo')
    .expect(200, 'boo', done);
});

it('should be added to the apiDoc', function(done) {
  request(app)
    .get('/v3/api-docs')
    .set('Host', 'test-host')
    .expect(200)
    .end(function(err, result) {
      expect(result.body).to.eql(require('./fixtures/expected-api-doc.json'));
      done(err);
    });
});
