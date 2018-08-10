import OpenapiFramework from '../../../index';
import { expect } from 'chai';
const path = require('path');

describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;

  beforeEach(function() {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      featureType: 'middleware',
      name: 'some-framework',
      paths: path.resolve(__dirname, 'frankenstein-api'),
    });
  });

  it('should throw', () => {
    expect(() => {
      framework.initialize({});
    }).to.throw('some-framework: args.paths contained a value that was not a path to a directory');
  });
});
