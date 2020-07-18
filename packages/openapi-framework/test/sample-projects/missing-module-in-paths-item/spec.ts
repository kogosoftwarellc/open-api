import { expect } from 'chai';
import OpenapiFramework from '../../../';
const path = require('path');

describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;

  beforeEach(() => {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      featureType: 'middleware',
      name: 'some-framework',
      paths: [{ path: 'asdf' }],
    });
  });

  it('should throw an error', () => {
    expect(() => {
      framework.initialize({});
    }).to.throw(
      'some-framework: args.paths must consist of strings or valid route specifications'
    );
  });
});
