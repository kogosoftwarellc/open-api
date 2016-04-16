var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var sut = require('../index');

describe('fetch-openapi', function() {
  it('should output an api service factory', function() {
    expect(sut(require('./fixtures/input.json'))).to.equal(fs.readFileSync(
        path.resolve(__dirname, './fixtures/output.js'), 'utf8'));
  });

  describe('the api service factory', function() {
    it('should have valid syntax', function() {
      expect(function() {
        require('./fixtures/output.js');
      }).to.not.throw();
    });

    it('should export methods', function() {
      expect(require('./fixtures/output.js')({}).addPet).to.be.a('function');
    });
  });
});
