import OpenapiFramework from '../../../';
import { expect } from 'chai';
const path = require('path');

describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;

  beforeEach(function() {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      featureType: 'middleware',
      name: 'some-framework',
      paths: path.resolve(__dirname, 'paths'),
    });
  });

  it('should work', () => {
    expect(() => {
      framework.initialize({});
    }).to.throw('some-framework: Invalid response $ref or definition not found in apiDoc.responses: #/responses/FooResponse');
  });
});
