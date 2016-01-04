var bodyParser = require('body-parser');
var express = require('express');
var expect = require('chai').expect;
var glob = require('glob');
var path = require('path');
var baseDir = path.resolve(__dirname, 'data-driven');
var request = require('supertest');
var sut = require('../');

describe('express-openapi-validation', function() {
  glob.sync('*.js', {cwd: baseDir}).forEach(function(fixture) {
    var testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));

    it('should ' + testName, function(done) {
      if (fixture.constructorError) {
        expect(function() {
          sut(fixture.validateArgs);
        }).to.throw(fixture.constructorError);
        return done();
      }

      var test = request(sampleApp(sut(fixture.validateArgs)));
      var path = '/test' + fixture.path;

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

      test.expect(fixture.statusCode, fixture.responseBody, done);
    });
  });

  function sampleApp(validationMiddleware) {
    var app = express();

    app.use(bodyParser.json());

    [
      'get',
      'post'
    ].forEach(function(method) {
      app[method]('/test', validationMiddleware, function(req, res) {
        res.status(200).json('woot');
      });

      app[method]('/test/:path1', validationMiddleware, function(req, res) {
        res.status(200).json('woot');
      });

      app[method]('/test/:path1/:path2', validationMiddleware, function(req, res) {
        res.status(200).json('woot');
      });
    });

    app.use(function(err, req, res, next) {
      res.status(err.status).json(err);
    });

    return app;
  }
});
