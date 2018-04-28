var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

describe('with trailing slash in basePath', function() {
  it('should expose api docs', function(done) {
    request(app)
      .get('/v3/api-docs')
      .expect(200)
      .end(done);
  });

  it('should expose routes', function(done) {
    request(app)
      .get('/v3/users')
      .expect(200, [{name: 'fred'}], done);
  });
});
