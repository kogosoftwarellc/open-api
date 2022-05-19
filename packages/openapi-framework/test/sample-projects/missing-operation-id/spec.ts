import { expect } from 'chai';
import OpenapiFramework from '../../../';
const path = require('path');

function ignore(message: any) {
  // Logger operation ignored
}

describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;
  const warnings: any[] = [];

  beforeEach(() => {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      featureType: 'middleware',
      name: 'some-framework',
      operations: {},
      logger: {
        debug: ignore,
        error: ignore,
        info: ignore,
        trace: ignore,
        warn: (message: any) => {
          warnings.push(message);
        },
      },
    });
  });

  it('should log a warning', async () => {
    await framework.initialize({});
    expect(warnings).to.deep.equal([
      'some-framework: path /foo, operation get is missing an operationId',
    ]);
  });
});
