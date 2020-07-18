const expect = require('chai').expect;
const glob = require('glob');
const path = require('path');
const baseDir = path.resolve(__dirname, 'data-driven');
import Sut from '../';

describe(require('../package.json').name, () => {
  glob.sync('*.js', { cwd: baseDir }).forEach((fixture) => {
    const testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));

    it('should ' + testName, () => {
      if (fixture.constructorError) {
        expect(() => {
          /* tslint:disable-next-line:no-unused-expression */
          new Sut(fixture.args);
        }).to.throw(fixture.constructorError);
        return;
      }

      const instance = new Sut(fixture.args);
      const request = fixture.request;
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
