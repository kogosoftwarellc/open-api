import 'mocha';
import { expect } from 'chai';
import OpenapiFramework from '../index';
const fs = require('fs');
const path = require('path');


describe('OpenapiFramework', () => {
  it('should be a function', () => {
    expect(OpenapiFramework).to.be.a('function');
  });

  describe('instantiating', () => {
    let options;

    beforeEach(function() {
      options = {
        apiDoc: fs.readFileSync(path.resolve(__dirname, './fixtures/apiDoc.yml'), 'utf8'),
        paths: './test/fixtures/paths'
      };
    });

    describe('without any options', () => {
      it('should fail', () => {
        expect(() => {
          new OpenapiFramework();
        }).to.throw('args.apiDoc is required');
      });
    });

    describe('with all options', () => {
      it('should work', () => {
        new OpenapiFramework(options);
      });
    });

    [
      'apiDoc',
      'paths'
    ].forEach(spec => {
      describe(`when options.${spec} is missing`, () => {
        beforeEach(function() {
          delete options[spec];
        });

        it('should throw', () => {
          expect(() => {
            new OpenapiFramework(options);
          }).to.throw(`args.${spec} is required`);
        });
      });
    });
  });
});
