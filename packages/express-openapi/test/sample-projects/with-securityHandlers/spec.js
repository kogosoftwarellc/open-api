var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

describe('with api wide security only', function() {
  it('should be used', function(done) {
    request(app)
      .get('/v3/boo')
      .expect(200, 'booboo2', done);
  });
});

describe('with operation security', function() {
  it('should override api wide security', function(done) {
    request(app)
      .get('/v3/foo')
      .expect(200, 'foo', done);
  });
});

describe('when authentication fails', function() {
  it('should respond with an error', function(done) {
    request(app)
      .get('/v3/fail')
      .expect(401, '', function(err, results) {
        expect(results.res.headers['www-authenticate']).to.equal('Basic realm=foo');
        done(err);
      });
  });
});
