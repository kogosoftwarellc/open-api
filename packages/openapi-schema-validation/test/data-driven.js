var expect = require('chai').expect;
var glob = require('glob');
var path = require('path');
var baseDir = path.resolve(__dirname, 'data-driven');
var sut = require('../');

describe(require('../package.json').name, function() {
  describe('.validate()', function() {
    glob.sync('*.js', {cwd: baseDir}).forEach(function(fixture) {
      var testName = path.basename(fixture, '.js').replace(/-/g, ' ');
      fixture = require(path.resolve(baseDir, fixture));
      it('should ' + testName, function() {
        var errors = sut.validate(fixture.apiDoc, fixture.validator).errors;
        expect(JSON.stringify(errors, null, '  '))
            .to.equal(JSON.stringify(fixture.errors, null, '  '));
      });
    });
  });
});
