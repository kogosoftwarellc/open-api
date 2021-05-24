var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function () {
  app = require('./app.js');
});

it('should use parameter references', function (done) {
  request(app)
    .get('/v3/foo?name=barney')
    .expect(
      400,
      {
        status: 400,
        errors: [
          {
            path: 'boo',
            errorCode: 'required.openapi.requestValidation',
            message: "must have required property 'boo'",
            location: 'query',
          },
          {
            path: 'foo',
            errorCode: 'required.openapi.requestValidation',
            message: "must have required property 'foo'",
            location: 'query',
          },
        ],
      },
      done
    );
});

it('should use response references', function (done) {
  request(app)
    .get('/v3/foo?foo=error&boo=success')
    .expect(
      500,
      {
        errors: [
          {
            errorCode: 'enum.openapi.responseValidation',
            message: 'must be equal to one of the allowed values',
            path: 'response',
          },
        ],
        message: 'The response was not valid.',
        status: 500,
      },
      done
    );
});
