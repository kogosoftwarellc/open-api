var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

describe('with trailing slash in basePath', () => {
  it('should expose api docs', function(done) {
    request(app)
      .get('/v3/api-docs')
      .expect(200)
      .end(done);
  });

  it('should expose routes', function(done) {
    request(app)
      .post('/v3/users')
      .send({ name: 'fred' })
      .expect(400)
      .end(function(err, res) {
        expect(res.body).to.eql('something was missing');
        done(err);
      });
  });
});
