var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

describe('when pathSecurity matches the path', function() {
  it('should have security applied', function(done) {
    request(app)
      .get('/v3/fail')
      .expect(401, 'failed auth1', function(err, results) {
        expect(results.res.headers['www-authenticate']).to.equal('Basic realm=foo');
        done(err);
      });
  });

  it('should have security applied', function(done) {
    request(app)
      .get('/v3/foo')
      .expect(401, 'failed auth2', function(err, results) {
        expect(results.res.headers['www-authenticate']).to.equal('Basic realm=foo');
        done(err);
      });
  });

  it('should not override path security', function(done) {
    request(app)
      .get('/v3/fooo')
      .expect(200, 'fooo', done);
  });

  it('should be added to the apiDoc', function(done) {
    request(app)
      .get('/v3/api-docs')
      .set("Host", "test-host")
      .expect(200)
      .end(function(err, result) {
        expect(result.body).to.eql(require('./fixtures/expected-api-doc.json'));
        done(err);
      });
  });
});

describe('when pathSecurity does not match the path', function() {
  it('should not have security applied', function(done) {
    request(app)
      .get('/v3/boo')
      .expect(200, 'boo', done);
  });
});
