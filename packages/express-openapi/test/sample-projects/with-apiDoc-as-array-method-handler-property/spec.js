var app;
var expect = require('chai').expect;
var expectedApiDoc = require('../../../../../test/fixtures/basic-usage-api-doc-after-initialization.json');
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

it('should expose <apiDoc>.basePath/api-docs', function(done) {
  request(app)
    .get('/v3/api-docs')
    .set('Host', 'test-host')
    .expect(200, expectedApiDoc, done);
});
