const expect = require('chai').expect;
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const request = require('supertest');

describe(require('../package.json').name + ' sample-projects', () => {
  glob
    .sync('./sample-projects/*', { cwd: __dirname })
    .forEach((sampleProjectPath) => {
      const specName = path.basename(sampleProjectPath);
      const specPath = path.resolve(__dirname, sampleProjectPath, 'spec.js');

      if (
        [
          // progressively move sample project tests up
          'basic-usage',
        ].indexOf(specName) > -1
      ) {
        return;
      }

      if (fs.existsSync(specPath)) {
        describe(specName, () => {
          require(specPath);
        });
      }
    });
});

require('../../../test/sample-projects.js')(
  require('../package.json').name,
  __dirname
);
