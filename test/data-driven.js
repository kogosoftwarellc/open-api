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
      var test = request(sampleApp(sut(fixture.parameters, fixture.definitions)));
      var path = '/test' + fixture.path;

      if (fixture.requestMethod === 'post') {
        test = test.post(path).send(fixture.requestBody);
      } else {
        test = test.get(path);
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
    });

    app.use(function(err, req, res, next) {
      res.status(err.status).json(err);
    });

    return app;
  }
});
