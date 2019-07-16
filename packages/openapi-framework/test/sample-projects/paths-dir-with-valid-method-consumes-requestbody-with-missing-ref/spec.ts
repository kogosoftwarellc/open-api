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
      paths: path.resolve(__dirname, 'paths')
    });
  });

  it('should throw missing $ref error', () => {
    expect(() => {
      framework.initialize({});
    }).to.throw(
      'some-framework: Invalid requestBody $ref or definition not found in apiDoc.components.requestBodies: #/components/requestBodies/Bar'
    );
  });
});
