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
      paths: path.resolve(__dirname, 'paths'),
    });
  });

  it('should work', () => {
    framework.initialize({
      visitOperation(ctx) {
        expect(ctx.features.responseValidator).to.not.be.undefined;
        expect(ctx.features.requestValidator).to.be.undefined;
        expect(ctx.features.coercer).to.be.undefined;
        expect(ctx.features.defaultSetter).to.be.undefined;
        expect(ctx.features.securityHandler).to.be.undefined;
      },
      visitApi(ctx) {
        const apiDoc = ctx.getApiDoc();
        expect(apiDoc.paths['/foo']).to.eql({
          parameters: [],
          get: {
            responses: {
              default: {
                description: 'return foo',
                schema: {}
              }
            },
          },
        });
      }
    });
  });
});
