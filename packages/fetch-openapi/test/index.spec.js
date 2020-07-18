var expect = require('chai').expect;
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var sut = require('../index');

describe('fetch-openapi', function () {
  glob.sync('./fixtures/*', { cwd: __dirname }).forEach(function (dirPath) {
    var specName = path.basename(dirPath).replace(/-/g, ' ');
    var inputPath = path.resolve(__dirname, dirPath, './input.json');
    var optionsPath = path.resolve(__dirname, dirPath, './options.js');
    var outputPath = path.resolve(__dirname, dirPath, './output.js');
    var errorPath = path.resolve(__dirname, dirPath, './error.json');
    var expectedError = fs.existsSync(errorPath) ? require(errorPath) : null;
    var options = require(optionsPath);

    describe(specName, function () {
      if (expectedError) {
        it('should throw ' + expectedError, function () {
          expect(function () {
            sut(require(inputPath), optionsPath);
          }).to.throw(expectedError);
        });
      } else {
        it('should output an api service factory', function () {
          expect(sut(require(inputPath), options)).to.equal(
            fs.readFileSync(outputPath, 'utf8')
          );
        });

        if (process.version.indexOf('v0.') !== 0 && options.preset === 'node') {
          describe('the api service factory', function () {
            it('should have valid syntax', function () {
              expect(function () {
                require(outputPath);
              }).to.not.throw();
            });

            it('should export methods', function () {
              expect(require(outputPath)(options).addPet).to.be.a('function');
            });
          });
        }
      }
    });
  });

  describe('when an unknown preset is used', function () {
    it('should throw an error', function () {
      expect(function () {
        sut({}, { preset: 'asdf' });
      }).to.throw(/preset/);
    });
  });
});
