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

  it('should add consumes to operation context from requestBody', async () => {
    await framework.initialize({
      visitOperation(ctx) {
        expect(ctx.consumes).to.eql(['application/json']);
        expect(ctx.operationDoc).to.eql({
          requestBody: {
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
          responses: {
            '200': {
              description: 'return foo',
              content: {
                'application/json': {
                  schema: {},
                },
              },
            },
          },
          tags: ['example', 'testing'],
        });
      },
      visitApi(ctx) {
        const apiDoc = ctx.getApiDoc();
        expect(apiDoc.tags).to.eql([{ name: 'example' }, { name: 'testing' }]);
      },
    });
  });
});
