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
      validateApiDoc: false,
    });
  });

  it('should work', () => {
    framework.initialize({
      visitApi(ctx) {
        const apiDoc = ctx.getApiDoc();
        expect(apiDoc.paths).to.have.property('/foo');
      }
    });
  });
});
