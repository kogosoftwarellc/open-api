var app;
var expect = require('chai').expect;
var request = require('supertest');

before(async function () {
  app = await require('./app.js')();
});

it('should upload a file', function (done) {
  request(app).post('/v3/fileupload').expect(200, {}, done);
});
