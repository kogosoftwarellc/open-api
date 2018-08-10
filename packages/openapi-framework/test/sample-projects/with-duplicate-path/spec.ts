import OpenapiFramework from '../../../index';
import { expect } from 'chai';
const path = require('path');

describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;

  beforeEach(function() {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      featureType: 'middleware',
      name: 'some-framework',
      paths: [
        {
          path: '/zoo',
          module: require('./paths/foo')
        },
        {
          path: '/zoo',
          module: require('./paths/foo')
        }
      ],
    });
  });

  it('should throw', () => {
    expect(() => {
      framework.initialize({});
    }).to.throw('some-framework: args.paths produced duplicate urls for "/zoo"');
  });
});
