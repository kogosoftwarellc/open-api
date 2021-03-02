'use strict';
const expect = require('chai').expect;
const supertest = require('supertest');
const http = require('http');

describe('with openapiv3 formData params', () => {
  let app;
  let request;
  let server;

  before(function () {
    app = require('./app.js');
    server = http.createServer(app.callback());
    request = supertest(server);
  });

  after(() => {
    server.close();
  });

  it('should coerce the types on formData fields', function (done) {
    request
      .post('/test')
      .send('name=Fred&isCool=true&age=38')
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.eql({
          name: 'Fred',
          isCool: true,
          age: 38,
        });
        done(err);
      });
  });
});
