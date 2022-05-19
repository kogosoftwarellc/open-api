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
      paths: path.resolve(__dirname, 'frankenstein-api'),
    });
  });

  it('should throw', async () => {
    await expect(framework.initialize({})).to.eventually.rejectedWith(
      'some-framework: args.paths contained a value that was not a path to a directory'
    );
  });
});
