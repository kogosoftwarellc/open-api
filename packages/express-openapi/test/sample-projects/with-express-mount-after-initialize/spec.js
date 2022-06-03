var app;
var expect = require('chai').expect;
var request = require('supertest');

before(async function () {
  app = await require('./app.js')();
});

it('should expose apiDoc containing baseUrl with mountpath', function (done) {
  request(app)
    .get('/api/v3/api-docs')
    .expect(function (res) {
      expect(res.body).to.have.property('basePath', '/api/v3');
    })
    .expect(200, done);
});
