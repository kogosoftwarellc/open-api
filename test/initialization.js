var expect = require('chai').expect;
var express = require('express');
var expressOpenapi = require('../');
var path = require('path');
var routesDir = path.resolve(__dirname, './sample-projects/basic-usage/api-routes');
var sut = require('../');
var validDocument = {
  swagger: '2.0',
  info: {
    title: 'some api',
    version: '1.0.0'
  },
  paths: {}
};

describe(require('../package.json').name, function() {
  describe('.initialize()', function() {
    describe('args validation', function() {
      [
        ['args is not an object', null, /express-openapi: args must be an object/],
        ['args.app must be an express app', {}, /express-openapi: args.app must be an express app/],
        ['args.apiDoc required', {app: {}}, /express-openapi: args.apiDoc is required/],
        ['args.apiDoc not valid', {app: {}, apiDoc: {}}, /express-openapi: args.apiDoc was invalid.  See the output./],
        ['args.routes required', {app: {}, apiDoc: validDocument}, /express-openapi: args.routes must be a string/],
        ['args.routes non directory', {app: {}, apiDoc: validDocument, routes: 'asdasdfasdf'}, /express-openapi: args.routes was not a path to a directory/],
        ['args.routes non directory', {app: {}, apiDoc: validDocument, routes: routesDir, docsPath: true}, /express-openapi: args.docsPath must be a string when given/],
        ['args.errorTransformer', {app: {}, apiDoc: validDocument, routes: routesDir, errorTransformer: 'asdf'}, /express-openapi: args.errorTransformer must be a function when given/],
        ['args.externalSchemas', {app: {}, apiDoc: validDocument, routes: routesDir, externalSchemas: 'asdf'}, /express-openapi: args.externalSchemas must be an object when given/],
        ['args.middlewareBuilder', {app: {}, apiDoc: validDocument, routes: routesDir, middlewareBuilder: 'asdf'}, /express-openapi: args.middlewareBuilder must be a function when given/],
      ].forEach(function(test) {
        var description = test[0];
        var args = test[1];
        var expectedError = test[2];

        describe(description, function() {
          it('should throw an error', function() {
            expect(function() {
              sut.initialize(args);
            }).to.throw(expectedError);
          });
        });
      });
    });

    it('should throw an error when a route method apiDoc is invalid', function() {
      expect(function() {
        var app = express();

        expressOpenapi.initialize({
          apiDoc: require('./sample-projects/with-invalid-method-doc/api-doc.js'),
          app: app,
          docsPath: '/api-docs',
          // See https://github.com/kogosoftwarellc/express-openapi-validation#argserrortransformer
          // errorTransformer: null,
          // we could just pass in "api-routes" if process.cwd() was set to this directory.
          routes: path.resolve(__dirname, 'sample-projects', 'with-invalid-method-doc', 'api-routes')
        });
      }).to.throw(/express-openapi: args.apiDoc was invalid after populating paths.  See the output./);
    });

    it('should not throw an error when args.validateApiDoc is false and a route method apiDoc is invalid', function() {
      var app = express();

      expressOpenapi.initialize({
        apiDoc: require('./sample-projects/with-invalid-method-doc/api-doc.js'),
        app: app,
        docsPath: '/api-docs',
        validateApiDoc: false,
        routes: path.resolve(__dirname, 'sample-projects', 'with-invalid-method-doc', 'api-routes')
      });
    });

    it('should return the built apiDoc', function() {
      var expectedApiDoc = require(
          './fixtures/basic-usage-api-doc-after-initialization.json');
      var initializedApp = expressOpenapi.initialize({
        apiDoc: require('./sample-projects/basic-usage/api-doc.js'),
        app: express(),
        routes: routesDir
      });

      expect(initializedApp.apiDoc).to.eql(expectedApiDoc);
    });

    it('should require referenced parameter to exist', function() {
      expect(function() {
        require('./sample-projects/with-referenced-parameter-missing/app.js');
      }).to.throw(/Invalid parameter \$ref or definition not found in apiDoc\.parameters: #\/parameters\/Boo/);

    });

    it('should require referenced response to exist', function() {
      expect(function() {
        require('./sample-projects/with-referenced-response-missing/app.js');
      }).to.throw(/Invalid response \$ref or definition not found in apiDoc.responses: #\/responses\/SuccessResponse/);

    });
  });
});
