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
      operations: {
        getFoo(req, res) {
          // Operation body
        }
      },
      logger: {
        debug: ignore,
        error: ignore,
        info: ignore,
        trace: ignore,
        warn: (message: any) => {
          warnings.push(message);
        }
      }
    });
  });

  it('should throw an error', () => {
    expect(() => {
      framework.initialize({});
    }).to.throw("Cannot read property 'undefined' of undefined");
    expect(warnings).to.deep.equal([
      'some-framework: path /foo, operation get is missing an operationId'
    ]);
  });
});
