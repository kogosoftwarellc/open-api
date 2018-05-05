var express = require('express');
var expect = require('chai').expect;
var glob = require('glob');
var path = require('path');
var baseDir = path.resolve(__dirname, 'data-driven');
var request = require('supertest');
var sut = require('../');

describe(require('../package.json').name, function() {
  glob.sync('*.js', {cwd: baseDir}).forEach(function(fixture) {
    var testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));

    it('should ' + testName, function(done) {
      if (fixture.constructorError) {
        expect(function() {
          createSut(fixture);
        }).to.throw(fixture.constructorError);
        return done();
      }

      var test = request(sampleApp(createSut(fixture), fixture.expectationMiddleware))
          .get(fixture.path);

      var headers = fixture.headers;
      if (headers) {
        Object.keys(headers).forEach(function(header) {
          test = test.set(header, headers[header]);
        });
      }

      test.expect(fixture.expectedStatusCode, fixture.expectedResponse,
          function(err, result) {
            if (fixture.expectedHeaders) {
              Object.keys(fixture.expectedHeaders).forEach(function(name) {
                expect(result.res.headers[name]).to.equal(
                    fixture.expectedHeaders[name]);
              });
            }
            done(err);
          });
    });
  });

  function createSut(fixture) {
    return sut(fixture.securityDefinitions, fixture.securityHandlers,
        fixture.operationSecurity);
  }

  function sampleApp(securityMiddleware, expectationMiddleware) {
    var app = express();

    app.get('/', securityMiddleware, expectationMiddleware, function(req, res) {
      res.status(200).json('woo');
    });

    app.use(function(err, req, res, next) {
      res.status(err.status).json(err);
    });

    return app;
  }
});
