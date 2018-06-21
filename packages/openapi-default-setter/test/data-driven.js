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
          new Sut(fixture.args);
        }).to.throw(fixture.constructorError);
        return;
      }

      var instance = new Sut(fixture.args);
      var request = fixture.request;
      instance.handle(request);

      if (fixture.headers) {
        expect(request.headers).to.eql(fixture.headers);
      }

      if (fixture.params) {
        expect(request.params).to.eql(fixture.params);
      }

      if (fixture.query) {
        expect(request.query).to.eql(fixture.query);
      }
    });
  });
});
