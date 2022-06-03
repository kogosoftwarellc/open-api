import { use, expect } from 'chai';
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
      paths: [{ path: 'asdf' }],
    });
  });

  it('should throw an error', async () => {
    await expect(framework.initialize({})).to.eventually.rejectedWith(
      'some-framework: args.paths must consist of strings or valid route specifications'
    );
  });
});
