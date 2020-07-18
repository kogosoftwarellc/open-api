const expect = require('chai').expect;
const glob = require('glob');
const path = require('path');
const baseDir = path.resolve(__dirname, 'data-driven');
import Sut from '../';

describe(require('../package.json').name, () => {
  glob.sync('*.js', { cwd: baseDir }).forEach((fixture) => {
    const testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));
    it(`should ${testName}`, () => {
      const sut = new Sut(fixture.constructorArgs);
      const errors = sut.validate(fixture.apiDoc).errors;
      expect(errors).to.deep.equal(fixture.errors);
    });
  });
});
