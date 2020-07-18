const expect = require('chai').expect;
const glob = require('glob');
const path = require('path');
const baseDir = path.resolve(__dirname, 'data-driven');
import Sut from '../';

describe(require('../package.json').name, () => {
  glob.sync('*.js', { cwd: baseDir }).forEach((fixture) => {
    const testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));

    it('should ' + testName, async () => {
      if (fixture.constructorError) {
        expect(() => {
          /* tslint:disable-next-line:no-unused-expression */
          new Sut(fixture.constructorArgs);
        }).to.throw(fixture.constructorError);
        return;
      }

      const instance = new Sut(fixture.constructorArgs);
      const request = {
        headers: fixture.headers,
        path: fixture.path,
        user: void 0,
      };
      let err;
      try {
        await instance.handle(request);
      } catch (e) {
        err = e;
      }
      if ('expectedError' in fixture) {
        expect(err).to.eql(fixture.expectedError);
      }

      if ('expectedUser' in fixture) {
        expect(request.user).to.eql(fixture.expectedUser);
      }
    });
  });
});
