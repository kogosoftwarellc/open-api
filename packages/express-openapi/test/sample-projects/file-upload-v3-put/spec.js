var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

it('should fail without content-type', function(done) {
  request(app)
    .put('/fileupload')
    .expect(400, {
      status: 400,
      errors: [
        {
          errorCode: 'required.openapi.validation',
          message: 'media type is not specified',
          location: 'body',
        },
      ],
    }, done);
});

it('should fail with empty content-type', function(done) {
  request(app)
    .put('/fileupload')
    .set('content-type', '')
    .expect(400, {
      status: 400,
      errors: [
        {
          errorCode: 'required.openapi.validation',
          message: 'media type is not specified',
          location: 'body',
        },
      ],
    }, done);
});


it('should fail without content', function(done) {
  request(app)
    .put('/fileupload')
    .set('content-type', 'text/plain')
    .expect(400, {
      status: 400,
      errors: [
        {
          errorCode: 'type.openapi.validation',
          message: 'should be string',
          location: 'body',
        },
      ],
    }, done);
});

it('should upload a file', function(done) {
  request(app)
    .put('/fileupload')
    .set('content-type', 'text/plain')
    .send('foo')
    .expect(200, {}, done);
});
