const expect = require('chai').expect;
const supertest = require('supertest');
const http = require('http');

let app;
let request;
let server;

before(function () {
  app = require('./app.js');
  server = http.createServer(app.callback());
  request = supertest(server);
});

describe('with api wide security only', function () {
  it('should be used', function (done) {
    request.get('/v3/boo').expect(200, 'booboo2', done);
  });
});

describe('with operation security', function () {
  it('should override api wide security', function (done) {
    request.get('/v3/foo').expect(200, 'foo', done);
  });
});

describe('when authentication fails', function () {
  it('should respond with an error', function (done) {
    request
      .get('/v3/fail')
      .expect(401)
      .end(function (err, ctx) {
        expect(ctx.get('www-authenticate')).to.equal('Basic realm=foo');
        done(err);
      });
  });
});
