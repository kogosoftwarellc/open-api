// This file is meant to be required by <package>/test/sample-projects.js
const fs = require('fs');
const glob = require('glob');
const path = require('path');

module.exports = function(packageName, packageSampleProjectsFilePath) {
  describe(`${packageName} sample-projects`, () => {
    glob.sync('./sample-projects/*', {cwd: __dirname}).forEach(sampleProjectPath => {
      const specName = path.basename(sampleProjectPath, '.js');
      const specPath = path.resolve(packageSampleProjectsFilePath,
        'sample-projects', specName, 'spec.js');

      if (fs.existsSync(specPath)) {
        describe(specName, () => {
          require(sampleProjectPath)(require(specPath));
        });
      }
    });
  });
};
