var app;
var expect = require('chai').expect;
var request = require('supertest');

before(async function () {
  app = await require('./app.js')();
});

describe('with securityFilter', () => {
  it('should expose api docs', function (done) {
    request(app)
      .get('/v3/api-docs')
      .set('Authorization', 'Basic foo')
      .expect(200)
      .end(done);
  });

  it('should handle unauthorized users', function (done) {
    request(app)
      .get('/v3/api-docs')
      .expect(400, '"not authenticated to view api docs"', done);
  });
});
