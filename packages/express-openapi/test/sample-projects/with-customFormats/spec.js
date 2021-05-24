var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function () {
  app = require('./app.js');
});

describe('input validation', function () {
  it('should fail input', function (done) {
    request(app)
      .get('/v3/foo?foo=barney')
      .expect(
        400,
        {
          errors: [
            {
              errorCode: 'format.openapi.requestValidation',
              location: 'query',
              message: 'must match format "foo"',
              path: 'foo',
            },
          ],
          status: 400,
        },
        done
      );
  });

  it('should accept input', function (done) {
    request(app).get('/v3/foo?foo=foo').expect(200, { name: 'foo' }, done);
  });
});

describe('response validation', function () {
  it('should fail', function (done) {
    request(app)
      .post('/v3/foo?foo=barney')
      .expect(
        400,
        {
          errors: [
            {
              errorCode: 'format.openapi.responseValidation',
              message: 'must match format "foo"',
              path: 'name',
            },
          ],
        },
        done
      );
  });

  it('should pass', function (done) {
    request(app).post('/v3/foo?foo=foo').expect(200, { errors: [] }, done);
  });
});
