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

  it('should succeed validation with reference for requestBody', async () => {
    await framework.initialize({
      visitOperation(ctx) {
        expect(ctx.features.requestValidator).to.not.be.undefined;
        const err = ctx.features.requestValidator.validateRequest({
          body: { title: 'test' },
          headers: { 'content-type': 'application/json' },
        });
        expect(err).to.be.undefined;
      },
    });
  });

  it('should fail validation with reference for requestBody', async () => {
    await framework.initialize({
      visitOperation(ctx) {
        expect(ctx.features.requestValidator).to.not.be.undefined;
        const err = ctx.features.requestValidator.validateRequest({
          body: {},
          headers: { 'content-type': 'application/json' },
        });
        expect(err).not.to.be.undefined;
      },
    });
  });
});
