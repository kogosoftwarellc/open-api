const expect = require('chai').expect;
const glob = require('glob');
const path = require('path');
const baseDir = path.resolve(__dirname, 'data-driven');
import { convertParametersToJSONSchema } from '../';

describe('openapi-jsonschema-parameters', () => {
  glob.sync('*.js', { cwd: baseDir }).forEach((fixture) => {
    const testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));

    it(`should ${testName}`, () => {
      expect(convertParametersToJSONSchema(fixture.parameters)).to.eql(
        fixture.outputSchema
      );
    });
  });
});
