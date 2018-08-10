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
      var sut = new Sut(fixture.constructorArgs);
      var errors = sut.validate(fixture.apiDoc).errors;
      expect(errors).to.deep.equal(fixture.errors);
    });
  });
});
