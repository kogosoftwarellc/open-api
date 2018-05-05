var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

it('should expose apiDoc containing baseUrl with mountpath', function(done) {
  request(app)
    .get('/grandparent/parent/v3/api-docs')
    .expect(function(res) {
      expect(res.body).to.have.property('basePath', '/grandparent/parent/v3');
    })
    .expect(200, done);
});
