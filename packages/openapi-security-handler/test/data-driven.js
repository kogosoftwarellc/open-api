var expect = require('chai').expect;
var glob = require('glob');
var path = require('path');
var baseDir = path.resolve(__dirname, 'data-driven');
var Sut = require('../');

describe(require('../package.json').name, function() {
  glob.sync('*.js', {cwd: baseDir}).forEach(function(fixture) {
    var testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));

    it('should ' + testName, function(done) {
      if (fixture.constructorError) {
        expect(function() {
          new Sut(fixture.constructorArgs);
        }).to.throw(fixture.constructorError);
        return done();
      }

      var instance = new Sut(fixture.constructorArgs);
      var request = {
        headers: fixture.headers,
        path: fixture.path,
      };
      instance.handle(request, function(err, result) {
        if ('expectedError' in fixture) {
          expect(err).to.eql(fixture.expectedError);
        }

        if ('expectedResult' in fixture) {
          expect(result).to.eql(fixture.expectedResult);
        }

        if ('expectedUser' in fixture) {
          expect(request.user).to.eql(fixture.expectedUser);
        }

        done();
      });
    });
  });
});
