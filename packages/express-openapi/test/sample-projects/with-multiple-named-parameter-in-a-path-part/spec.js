var app;
var expect = require('chai').expect;
var expectedApiDoc = require('../../../../../test/fixtures/basic-usage-api-doc-after-initialization.json');
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

it('should have a resource with multiple named parameters as resource basename', function(done) {
  request(app)
    .get('/v3/users/foo@bar')
    .expect(200)
    .expect(
      {
        id: 'foo',
        org: 'bar'
      },
      done
    );
});

it('should have a resource with multiple named parameters as a resource directory name', function(done) {
  request(app)
    .get('/v3/foo-bar/boo')
    .expect(200)
    .expect(
      {
        id: 'boo',
        region: 'foo',
        az: 'bar'
      },
      done
    );
});

it('should have a resource with multiple named parameters as both of directory and base name', function(done) {
  request(app)
    .get('/v3/foo-bar/boo.png')
    .expect(404)
    .expect(
      {
        message: 'file not found',
        id: 'boo',
        region: 'foo',
        az: 'bar',
        type: 'png'
      },
      done
    );
});
