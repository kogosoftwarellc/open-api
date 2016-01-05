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
          sut(fixture.args);
        }).to.throw(fixture.constructorError);
        return done();
      }

      var assertionMiddleware = function(req, res, next) {
        if (fixture.headers) {
          var headers = {};
          for (var header in fixture.headers) {
            if (header in req.headers) {
              headers[header] = req.headers[header];
            }
          }

          expect(headers).to.eql(fixture.headers);
        }

        if (fixture.params) {
          expect(req.params).to.eql(fixture.params);
        }

        if (fixture.query) {
          expect(req.query).to.eql(fixture.query);
        }

        next();
      };
      var test = request(sampleApp(sut(fixture.args), assertionMiddleware));
      var path = fixture.requestPath;

      if (fixture.requestMethod === 'post') {
        test = test.post(path).send(fixture.requestBody);
      } else {
        test = test.get(path);
      }

      var headers = fixture.headers;

      if (headers) {
        Object.keys(headers).forEach(function(header) {
          test = test.set(header, headers[header]);
        });
      }

      test.expect(200, done);
    });
  });

  function sampleApp(coercionMiddleware, assertionMiddleware) {
    var app = express();

    function woot(req, res) {
      res.status(200).json('woot');
    }

    app.use(function(err, req, res, next) {
      res.status(err.status).json(err);
    });

    app.get('/', coercionMiddleware, assertionMiddleware, woot);
    app.get('/:path1/:path2', coercionMiddleware, assertionMiddleware, woot);

    return app;
  }
});
