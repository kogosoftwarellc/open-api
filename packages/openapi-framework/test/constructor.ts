/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import 'mocha';
import { Logger } from 'ts-log';
import OpenapiFramework from '../';
const fs = require('fs');
const path = require('path');

describe('OpenapiFramework', () => {
  it('should be a function', () => {
    expect(OpenapiFramework).to.be.a('function');
  });

  describe('instantiating', () => {
    let options;

    beforeEach(() => {
      options = {
        apiDoc: fs.readFileSync(
          path.resolve(__dirname, './fixtures/apiDoc-valid.yml'),
          'utf8'
        ),
        featureType: 'middleware',
        name: 'express-openapi',
        paths: './test/fixtures/paths',
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

    ['apiDoc', 'featureType', 'name'].forEach((spec) => {
      describe(`when options.${spec} is missing`, () => {
        beforeEach(() => {
          delete options[spec];
        });

        it('should throw', () => {
          expect(() => {
            new OpenapiFramework(options);
          }).to.throw(`args.${spec} is required`);
        });
      });
    });

    describe('when options.paths and options.operations are missing', () => {
      beforeEach(() => {
        delete options.paths;
      });

      it('should throw', () => {
        expect(() => {
          new OpenapiFramework(options);
        }).to.throw(`args.paths and args.operations must not both be empty`);
      });
    });

    [
      ['errorTransformer', 'function'],
      ['externalSchemas', 'object'],
      ['securityHandlers', 'object'],
    ].forEach((spec) => {
      describe(`when options.${spec[0]} is of the wrong type`, () => {
        beforeEach(() => {
          options[spec[0]] = void 0;
        });

        it('should throw', () => {
          expect(() => {
            new OpenapiFramework(options);
          }).to.throw(`args.${spec[0]} must be a ${spec[1]} when given`);
        });
      });
    });

    describe('when apiDoc is an object representing a valid apiDoc', () => {
      beforeEach(() => {
        options.apiDoc = require('./fixtures/apiDoc-valid.js');
      });

      it('should not throw an error', () => {
        new OpenapiFramework(options);
      });
    });

    ['yml', 'js', 'json'].forEach((file) => {
      describe(`when apiDoc is a path to a valid ${file} file`, () => {
        beforeEach(() => {
          options.apiDoc = `./test/fixtures/apiDoc-valid.${file}`;
        });

        it('should not throw an error', () => {
          new OpenapiFramework(options);
        });
      });
    });

    describe('pathSecurity', () => {
      [
        {
          name: 'when not given as an array',
          error: 'must be an instance of Array when given',
          value: null,
        },
        {
          name: 'when not given array of tuples',
          error: 'expects an array of tuples',
          value: [null],
        },
        {
          name: 'when given empty tuple',
          error: 'tuples expect the first argument to be a RegExp',
          value: [[]],
        },
        {
          name: 'when given tuple with invalid 1st argument',
          error: 'tuples expect the first argument to be a RegExp',
          value: [[null]],
        },
        {
          name: 'when given tuple with no 2nd argument',
          error: 'tuples expect the second argument to be a security Array',
          value: [[/asdf/]],
        },
        {
          name: 'when given tuple with invalid 2nd argument',
          error: 'tuples expect the second argument to be a security Array',
          value: [[/asdf/, null]],
        },
      ].forEach((spec) => {
        describe(spec.name, () => {
          it('should throw an error', () => {
            options.pathSecurity = spec.value;
            expect(() => {
              new OpenapiFramework(options);
            }).to.throw(spec.error);
          });
        });
      });

      describe('when given a valid tuple', () => {
        it('should not throw an error', () => {
          options.pathSecurity = [[/asdf/, []]];
          new OpenapiFramework(options);
        });
      });
    });

    describe('apiDoc validation', () => {
      describe('when enabled', () => {
        describe('when apiDoc is invalid', () => {
          beforeEach(() => {
            options.apiDoc = 'asdfasdf';
          });

          it('should throw', () => {
            expect(() => {
              new OpenapiFramework(options);
            }).to.throw(`args.apiDoc was invalid`);
          });
        });

        describe('when apiDoc is valid', () => {
          it('should not throw an error', () => {
            new OpenapiFramework(options);
          });
        });
      });

      describe('when disabled', () => {
        beforeEach(() => {
          options.validateApiDoc = false;
        });

        describe('when apiDoc is invalid', () => {
          beforeEach(() => {
            options.apiDoc = 'asdfasdf';
          });

          it('should not throw', () => {
            new OpenapiFramework(options);
          });
        });
      });
    });

    describe('logging', () => {
      it('should accept console as a logger', () => {
        options.logger = console;
        new OpenapiFramework(options);
      });
    });
  });
});
