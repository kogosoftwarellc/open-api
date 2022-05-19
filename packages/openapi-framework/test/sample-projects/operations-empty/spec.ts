/* tslint:disable:no-unused-expression */
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
      operations: {},
    });
  });

  it('should work', async () => {
    let postFeatures;
    let getFeatures;
    await framework.initialize({
      visitOperation(ctx) {
        if (ctx.methodName === 'get') {
          getFeatures = ctx.features;
        } else if (ctx.methodName === 'post') {
          postFeatures = ctx.features;
        }
      },
      visitApi(ctx) {
        const apiDoc = ctx.getApiDoc();
        expect(apiDoc.paths['/foo']).to.eql({
          get: {
            operationId: 'getFoo',
            responses: {
              default: {
                description: 'return foo',
                schema: {},
              },
            },
          },
          post: {
            operationId: 'postFoo',
            responses: {
              default: {
                description: 'return foo',
                schema: {},
              },
            },
          },
          parameters: [],
        });
      },
    });
    expect(getFeatures.responseValidator).to.not.be.undefined;
    expect(getFeatures.requestValidator).to.be.undefined;
    expect(getFeatures.coercer).to.be.undefined;
    expect(getFeatures.defaultSetter).to.be.undefined;
    expect(getFeatures.securityHandler).to.be.undefined;
    expect(postFeatures.responseValidator).not.to.be.undefined;
    expect(postFeatures.requestValidator).to.be.undefined;
    expect(postFeatures.coercer).to.be.undefined;
    expect(postFeatures.defaultSetter).to.be.undefined;
    expect(postFeatures.securityHandler).to.be.undefined;
  });
});
