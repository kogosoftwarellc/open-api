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
          sut(fixture.constructorArgs);
        }).to.throw(fixture.constructorError);
        return done();
      }

      request(sampleApp(sut(fixture.constructorArgs), fixture.inputStatusCode,
          fixture.inputResponseBody))
          .get('/test')
          .expect(200, fixture.expectedValidationError, done);
    });
  });

  function sampleApp(validationMiddleware, inputStatusCode, inputResponseBody) {
    var app = express();

    app.get('/test', validationMiddleware, function(req, res) {
      var validation = res.validateResponse(inputStatusCode, inputResponseBody);
      // echo back the errors for validation in our test scripts.
      // the status code here is entirely arbitrary, as the middleware doesn't set
      // statusCodes at all.  It simply provides validation errors.
      res.status(200).json(validation);
    });

    return app;
  }
});
