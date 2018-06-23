var expect = require('chai').expect;
var glob = require('glob');
var path = require('path');
var baseDir = path.resolve(__dirname, 'data-driven');
var Sut = require('../');

describe(require('../package.json').name, function() {
  glob.sync('*.js', {cwd: baseDir}).forEach(function(fixture) {
    var testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));

    it('should ' + testName, function() {
      if (fixture.constructorError) {
        expect(function() {
          new Sut(fixture.validateArgs);
        }).to.throw(fixture.constructorError);
        return;
      }

      var validator = new Sut(fixture.validateArgs);
      var error = validator.validate(fixture.request);

      expect(error).to.eql(fixture.expectedError);
    });
  });
});
