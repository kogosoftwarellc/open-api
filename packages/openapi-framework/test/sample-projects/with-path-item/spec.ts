import OpenapiFramework from '../../../index';
const path = require('path');

describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;

  beforeEach(function() {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      featureType: 'middleware',
      name: 'some-framework',
      paths: [{
        path: '/zoo',
        module: require('./paths/foo')
      }],
    });
  });

  it('should work', () => {
    framework.initialize({});
  });
});
