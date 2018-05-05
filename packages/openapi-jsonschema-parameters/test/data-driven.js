var expect = require('chai').expect;
var glob = require('glob');
var path = require('path');
var baseDir = path.resolve(__dirname, 'data-driven');
var sut = require('../');

describe('openapi-jsonschema-parameters', function() {
  glob.sync('*.js', {cwd: baseDir}).forEach(function(fixture) {
    var testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));

    it('should ' + testName, function() {
      expect(sut(fixture.parameters)).to.eql(fixture.outputSchema);
    });
  });
});
