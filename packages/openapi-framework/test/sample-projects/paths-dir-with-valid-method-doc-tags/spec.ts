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

  it('should add sorted tags to the apiDoc', async () => {
    await framework.initialize({
      visitOperation(ctx) {
        expect(ctx.operationDoc).to.eql({
          responses: {
            default: {
              description: 'return foo',
              schema: {},
            },
          },
          tags: ['example', 'examples', 'pets', 'testing'],
        });
      },
      visitApi(ctx) {
        const apiDoc = ctx.getApiDoc();
        expect(apiDoc.tags).to.eql([
          { name: 'example' },
          { name: 'examples' },
          { name: 'pets' },
          { name: 'testing' },
        ]);
      },
    });
  });
});
