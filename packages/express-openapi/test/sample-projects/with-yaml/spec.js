var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

describe('with yaml apiDoc and yaml operationDoc', () => {
  it('should allow responses', function(done) {
    request(app)
      .get('/v3/users')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.eql([{name: 'fred'}]);
        done(err);
      });
  });

  it('should use catch errors', function(done) {
    request(app)
      .post('/v3/users')
      .send({name: 'fred'})
      .expect(400)
      .end(function(err, res) {
        expect(res.body).to.eql('something was missing');
        done(err);
      });
  });
});
