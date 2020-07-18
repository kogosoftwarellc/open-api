/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import OpenapiFramework from '../../../';
const path = require('path');

describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;

  beforeEach(() => {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      dependencies: {
        sum: (a, b) => {
          return a + b;
        },
      },
      featureType: 'middleware',
      name: 'some-framework',
      operations: {
        getFoo: require('./operations/foo'),
      },
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
            operationId: 'getFoo',
            responses: {
              default: {
                description: 'return foo',
                schema: {},
              },
            },
          },
        });
      },
    });
  });
});
