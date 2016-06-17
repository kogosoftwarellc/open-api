var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

describe('with operation consumes overriding api consumes', function() {
  it('should add the appropriate middleware', function(done) {
    request(app)
      .post('/v3/consumes')
      .type('text')
      .send('{}')
      .expect(200, 'object', done);
  });
});

describe('with operation consumes and no matching middleware for mime type', function() {
  it('should not add middleware', function(done) {
    request(app)
      .post('/v3/no-matching-operation-consumes')
      .type('text')
      .send('{}')
      .expect(200, 'undefined', done);
  });
});

describe('with no operation consumes', function() {
  it('should use api consumes', function(done) {
    request(app)
      .post('/v3/no-consumes')
      .type('text')
      .send('asdfasdf')
      .expect(200, 'string', done);
  });
});
