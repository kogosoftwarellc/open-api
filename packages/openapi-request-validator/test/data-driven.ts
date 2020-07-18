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
      if (fixture.constructorError) {
        expect(() => {
          /* tslint:disable-next-line:no-unused-expression */
          new Sut(fixture.validateArgs);
        }).to.throw(fixture.constructorError);
        return;
      }

      const validator = new Sut(fixture.validateArgs);
      const error = validator.validateRequest(fixture.request);

      expect(error).to.eql(fixture.expectedError);
    });
  });
});
