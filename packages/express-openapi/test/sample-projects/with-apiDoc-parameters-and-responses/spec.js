var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

it('should use parameter references', function(done) {
  request(app)
    .get('/v3/foo?name=barney')
    .expect(400, {
      status: 400,
      errors:[
        {
          path: 'boo',
          errorCode: 'required.openapi.validation',
          message: 'instance requires property \"boo\"',
          location:'query'
        },
        {
          path: 'foo',
          errorCode: 'required.openapi.validation',
          message: 'instance requires property \"foo\"',
          location: 'query'
        }
      ]
    }, done);
});

it('should use response references', function(done) {
  request(app)
    .get('/v3/foo?foo=error&boo=success')
    .expect(500, {
      errors: [
        {
          errorCode: 'enum.openapi.responseValidation',
          message: 'response is not one of enum values: error'
        }
      ],
      message: 'The response was not valid.',
      status: 500
    }, done);
});
