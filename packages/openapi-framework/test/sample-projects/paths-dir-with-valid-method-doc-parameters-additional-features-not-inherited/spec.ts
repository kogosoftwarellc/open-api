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
      paths: path.resolve(__dirname, 'paths'),
    });
  });

  it('should work', async () => {
    await framework.initialize({
      visitOperation(ctx) {
        expect(ctx.features.responseValidator).to.not.be.undefined;
        expect(ctx.features.requestValidator).to.not.be.undefined;
        expect(ctx.features.coercer).to.not.be.undefined;
        expect(ctx.features.defaultSetter).to.be.undefined;
        expect(ctx.features.securityHandler).to.be.undefined;
        expect(ctx.additionalFeatures.length).to.equal(0);
      },
      visitApi(ctx) {
        const apiDoc = ctx.getApiDoc();
        expect(apiDoc.paths['/foo']).to.eql({
          parameters: [
            {
              name: 'height',
              in: 'query',
              type: 'string',
            },
          ],
          get: {
            parameters: [
              {
                name: 'name',
                in: 'query',
                type: 'string',
              },
            ],
            responses: {
              default: {
                description: 'return foo',
                schema: {},
              },
            },
            'x-some-framework-inherit-additional-middleware': false,
          },
        });
      },
    });
  });
});
