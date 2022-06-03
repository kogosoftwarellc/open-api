import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import OpenapiFramework from '../../../';

const path = require('path');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);
describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;

  beforeEach(() => {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      featureType: 'middleware',
      name: 'some-framework',
      paths: [{ module: true }],
    });
  });

  it('should throw an error', async () => {
    await expect(framework.initialize({})).to.eventually.rejectedWith(
      'some-framework: args.paths must consist of strings or valid route specifications'
    );
  });
});
