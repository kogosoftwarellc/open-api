import { initialize } from '../';
const expect = require('chai').expect;
const express = require('express');
const path = require('path');
const routesDir = path.resolve(
  __dirname,
  './sample-projects/basic-usage/api-routes'
);
const validDocument = {
  swagger: '2.0',
  info: {
    title: 'some api',
    version: '1.0.0'
  },
  paths: {}
};

describe(require('../package.json').name, () => {
  describe('.initialize()', () => {
    describe('args validation', () => {
      [
        [
          'args is not an object',
          null,
          /express-openapi: args must be an object/
        ],
        [
          'args.app must be an express app',
          {},
          /express-openapi: args.app must be an express app/
        ],
        [
          'args.apiDoc required',
          { app: {} },
          /express-openapi: args.apiDoc is required/
        ],
        [
          'args.apiDoc not valid',
          { app: {}, apiDoc: {}, paths: [] },
          /express-openapi: args.apiDoc was invalid.  See the output./
        ],
        [
          'args.paths required',
          { app: {}, apiDoc: validDocument },
          /express-openapi: args.paths is required/
        ],
        [
          'args.paths non directory',
          { app: {}, apiDoc: validDocument, paths: 'asdasdfasdf' },
          /express-openapi: args.paths contained a value that was not a path to a directory/
        ],
        [
          'args.paths non directory',
          { app: {}, apiDoc: validDocument, paths: routesDir, docsPath: true },
          /express-openapi: args.docsPath must be a string when given/
        ],
        [
          'args.paths with invalid route',
          { app: {}, apiDoc: validDocument, paths: [{ foo: '/foo', bar: {} }] },
          /express-openapi: args.paths must consist of strings or valid route specifications/
        ],
        [
          'args.paths with duplicates',
          {
            app: {},
            apiDoc: validDocument,
            paths: [{ path: '/foo', module: {} }, { path: '/foo', module: {} }]
          },
          /express-openapi: args.paths produced duplicate urls/
        ],
        [
          'args.errorTransformer',
          {
            app: {},
            apiDoc: validDocument,
            paths: routesDir,
            errorTransformer: 'asdf'
          },
          /express-openapi: args.errorTransformer must be a function when given/
        ],
        [
          'args.externalSchemas',
          {
            app: {},
            apiDoc: validDocument,
            paths: routesDir,
            externalSchemas: 'asdf'
          },
          /express-openapi: args.externalSchemas must be a object when given/
        ],
        [
          'args.securityHandlers',
          {
            app: {},
            apiDoc: validDocument,
            paths: routesDir,
            securityHandlers: 'asdf'
          },
          /express-openapi: args.securityHandlers must be a object when given/
        ]
      ].forEach((test: [string, object, RegExp]) => {
        const description: string = test[0];
        const args = test[1];
        const expectedError = test[2];

        describe(description, () => {
          it('should throw an error', () => {
            expect(() => {
              // @ts-ignore
              initialize(args);
            }).to.throw(expectedError);
          });
        });
      });
    });

    it('should throw an error when a route method apiDoc is invalid', () => {
      expect(() => {
        const app = express();

        initialize({
          apiDoc: require('./sample-projects/with-invalid-method-doc/api-doc.js'),
          app,
          docsPath: '/api-docs',
          // See https://github.com/kogosoftwarellc/express-openapi-validation#argserrortransformer
          // errorTransformer: null,
          // we could just pass in "api-routes" if process.cwd() was set to this directory.
          paths: path.resolve(
            __dirname,
            'sample-projects',
            'with-invalid-method-doc',
            'api-routes'
          )
        });
      }).to.throw(
        /express-openapi: args.apiDoc was invalid after populating paths.  See the output./
      );
    });

    it('should not throw an error when args.validateApiDoc is false and a route method apiDoc is invalid', () => {
      const app = express();

      initialize({
        apiDoc: require('./sample-projects/with-invalid-method-doc/api-doc.js'),
        app,
        docsPath: '/api-docs',
        validateApiDoc: false,
        paths: path.resolve(
          __dirname,
          'sample-projects',
          'with-invalid-method-doc',
          'api-routes'
        )
      });
    });

    it('should return the built apiDoc', () => {
      const expectedApiDoc = require('./../../../test/fixtures/basic-usage-api-doc-after-initialization.json');
      const initializedApp = initialize({
        apiDoc: require('./sample-projects/basic-usage/api-doc.js'),
        app: express(),
        paths: routesDir
      });

      expect(initializedApp.apiDoc).to.eql(expectedApiDoc);
    });

    it('should require referenced parameter to exist', () => {
      expect(() => {
        require('./sample-projects/with-referenced-parameter-missing/app.js');
      }).to.throw(
        /Invalid parameter \$ref or definition not found in apiDoc\.parameters: #\/parameters\/Boo/
      );
    });

    it('should require referenced response to exist', () => {
      expect(() => {
        require('./sample-projects/with-referenced-response-missing/app.js');
      }).to.throw(
        /Invalid response \$ref or definition not found in apiDoc.responses: #\/responses\/SuccessResponse/
      );
    });

    it('should not throw when security handlers are defined and no method doc exists on a handler', () => {
      require('./sample-projects/securityHandlers-without-a-method-doc/app.js');
    });
  });
});
