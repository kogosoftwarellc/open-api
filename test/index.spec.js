const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const sut = require('../index');

describe('fetch-openapi', () => {
  it('should output an api service factory', () => {
    expect(sut(require('./fixtures/input.json'))).to.equal(fs.readFileSync(
        path.resolve(__dirname, './fixtures/output.js'), 'utf8'));
  });

  describe('the api service factory', () => {
    it('should have valid syntax', () => {
      expect(function() {
        require('./fixtures/output.js');
      }).to.not.throw();
    });

    it('should export methods', function() {
      expect(require('./fixtures/output.js')({}).addPet).to.be.a('function');
    });
  });
});
