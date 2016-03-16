var expect = require('chai').expect;
var request = require('supertest');

describe(require('../package.json').name + 'sample-projects', function() {
  describe('basic-usage', function() {
    var app = require('./sample-projects/basic-usage/app.js');
    var expectedApiDoc = require('./fixtures/basic-usage-api-doc-after-initialization.json');

    it('should expose <apiDoc>.basePath/api-docs', function(done) {
      request(app)
        .get('/v3/api-docs')
        .expect(200, expectedApiDoc, done);
    });

    it('should add response validation middleware when parameters are empty', function(done) {
      request(app)
        .delete('/v3/users')
        .expect(204, '', done);
    });

    it('should use defaults, coercion, and operation parameter overriding', function(done) {
      request(app)
        .get('/v3/users/34?name=fred')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({id: 34, name: 'fred', age: 80});
          done(err);
        });
    });

    it('should validate input', function(done) {
      request(app)
        .get('/v3/users/34?name=barney')
        .expect(400, {errors: [
          {
            errorCode: 'pattern.openapi.validation',
            location: 'query',
            message: 'instance.name does not match pattern \"^fred$\"',
            path: 'name'
          }
        ], status: 400}, done);
    });

    it('should use path parameters', function(done) {
      request(app)
        .post('/v3/users/34')
        .send({name: 'fred'})
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({id: '34'});
          done(err);
        });
    });

    it('should dereference #/definitions/ for validation', function(done) {
      var user = {};

      request(app)
        .post('/v3/users/34?name=barney')
        .send(user)
        .expect(400, {errors: [
          {
            errorCode: 'required.openapi.validation',
            location: 'body',
            message: 'instance requires property "name"',
            path: 'name'
          }
        ], status: 400}, done);
    });
  });

  describe('without-basePath-and-different-docsPath', function() {
    var app = require('./sample-projects/without-basePath-and-different-docsPath/app.js');

    it('should be mounted at the top level', function(done) {
      request(app)
        .get('/foo-docs')
        .expect(200, done);
    });
  });

  describe('with-errorTransformer', function() {
    var app = require('./sample-projects/with-errorTransformer/app.js');

    it('should transform errors', function(done) {
      request(app)
        .get('/v3/users/34?name=barney')
        .expect(400, {errors: [
          {fooError: 'oh yea'}
        ], status: 400}, done);
    });
  });

  describe('with-errorMiddleware', function() {
    var app = require('./sample-projects/with-errorMiddleware/app.js');

    describe('when an error occurs in the basePath', function() {
      it('should use the API error middleware', function(done) {
        request(app)
          .get('/v3/foo')
          .expect(200, '"hello from /v3/foo"', done);
      });
    });

    describe('when an error occurs outside the basePath', function() {
      it('should not use the API error middleware', function(done) {
        request(app)
          .get('/foo')
          .expect(200, '"hello from /foo"', done);
      });
    });
  });

  describe('with-customFormats', function() {
    var app = require('./sample-projects/with-customFormats/app.js');

    describe('input validation', function() {
      it('should fail input', function(done) {
        request(app)
          .get('/v3/foo?foo=barney')
          .expect(400, {errors: [
            {
             errorCode: 'format.openapi.validation',
             location: 'query',
             message: 'instance.foo does not conform to the "foo" format',
             path: 'foo'
            }
          ], status: 400}, done);
      });

      it('should accept input', function(done) {
        request(app)
          .get('/v3/foo?foo=foo')
          .expect(200, {name: 'foo'}, done);
      });
    });

    describe('response validation', function() {
      it('should fail', function(done) {
        request(app)
          .post('/v3/foo?foo=barney')
          .expect(400, {errors: [
            {
             errorCode: 'format.openapi.responseValidation',
             message: 'name does not conform to the "foo" format',
             path: 'name'
            }
          ]}, done);
      });

      it('should pass', function(done) {
        request(app)
          .post('/v3/foo?foo=foo')
          .expect(200, {errors: []}, done);
      });
    });
  });

  describe('with-exposeApiDocs-set-to-false', function() {
    var app = require('./sample-projects/with-exposeApiDocs-set-to-false/app.js');

    it('should not expose /api-docs', function(done) {
      request(app)
        .get('/v3/api-docs')
        .expect(404, done);
    });
  });

  describe('with-apiDoc-as-array-method-handler-property', function() {
    var app = require('./sample-projects/with-apiDoc-as-array-method-handler-property/app.js');
    var expectedApiDoc = require('./fixtures/basic-usage-api-doc-after-initialization.json');

    it('should expose <apiDoc>.basePath/api-docs', function(done) {
      request(app)
        .get('/v3/api-docs')
        .expect(200, expectedApiDoc, done);
    });
  });

  describe('configuring middleware', function() {
    var coercionMissingBody = {
      errors: [
        {
          errorCode: 'type.openapi.validation',
          location: 'path',
          message: 'instance.id is not of a type(s) integer',
          path: 'id'
        }
      ],
      status: 400
    };

    [
      // adding additional middleware
      {name: 'with-additional-middleware', url: '/v3/users/34?name=fred',
          expectedStatus: 200, expectedBody: {
            orderingApiDoc: 'pathModule',
            apiDocAdded: true,
            pathDocAdded: true,
            pathModuleAdded: true
          }},

      // not inheriting additional middleware
      {name: 'with-inherit-additional-middleware-false-at-methodDoc', url: '/v3/users/34?name=fred',
          expectedStatus: 200, expectedBody: {
            apiDocAdded: null,
            pathDocAdded: null,
            pathModuleAdded: null
          }},
      {name: 'with-inherit-additional-middleware-false-at-pathDoc', url: '/v3/users/34?name=fred',
          expectedStatus: 200, expectedBody: {
            apiDocAdded: null,
            pathDocAdded: true,
            pathModuleAdded: true
          }},
      {name: 'with-inherit-additional-middleware-false-at-pathModule', url: '/v3/users/34?name=fred',
          expectedStatus: 200, expectedBody: {
            apiDocAdded: null,
            pathDocAdded: null,
            pathModuleAdded: true
          }},

      // disable coercion
      {name: 'with-coercion-middleware-disabled-in-methodDoc', url: '/v3/users/34?name=fred',
          expectedStatus: 400, expectedBody: coercionMissingBody},
      {name: 'with-coercion-middleware-disabled-in-pathItem', url: '/v3/users/34?name=fred',
          expectedStatus: 400, expectedBody: coercionMissingBody},
      {name: 'with-coercion-middleware-disabled-in-pathModule', url: '/v3/users/34?name=fred',
          expectedStatus: 400, expectedBody: coercionMissingBody},
      {name: 'with-coercion-middleware-disabled-in-the-apiDoc', url: '/v3/users/34?name=fred',
          expectedStatus: 400, expectedBody: coercionMissingBody},

      // disable defaults
      {name: 'with-defaults-middleware-disabled-in-methodDoc', url: '/v3/users/34?name=fred',
          expectedStatus: 200, expectedBody: {id: 34, name: 'fred'}},
      {name: 'with-defaults-middleware-disabled-in-pathItem', url: '/v3/users/34?name=fred',
          expectedStatus: 200, expectedBody: {id: 34, name: 'fred'}},
      {name: 'with-defaults-middleware-disabled-in-pathModule', url: '/v3/users/34?name=fred',
          expectedStatus: 200, expectedBody: {id: 34, name: 'fred'}},
      {name: 'with-defaults-middleware-disabled-in-the-apiDoc', url: '/v3/users/34?name=fred',
          expectedStatus: 200, expectedBody: {id: 34, name: 'fred'}},

      // disable validation
      {name: 'with-validation-middleware-disabled-in-methodDoc', url: '/v3/users/asdf?name=fred',
          expectedStatus: 200, expectedBody: {age: 80, id: null, name: 'fred'}},
      {name: 'with-validation-middleware-disabled-in-pathItem', url: '/v3/users/asdf?name=fred',
          expectedStatus: 200, expectedBody: {age: 80, id: null, name: 'fred'}},
      {name: 'with-validation-middleware-disabled-in-pathModule', url: '/v3/users/asdf?name=fred',
          expectedStatus: 200, expectedBody: {age: 80, id: null, name: 'fred'}},
      {name: 'with-validation-middleware-disabled-in-the-apiDoc', url: '/v3/users/asdf?name=fred',
          expectedStatus: 200, expectedBody: {age: 80, id: null, name: 'fred'}},

      // disable all
      {name: 'with-middleware-disabled-in-methodDoc', url: '/v3/users/asdf?name=fred',
          expectedStatus: 200, expectedBody: {id: 'asdf', name: 'fred'}},
      {name: 'with-middleware-disabled-in-pathItem', url: '/v3/users/asdf?name=fred',
          expectedStatus: 200, expectedBody: {id: 'asdf', name: 'fred'}},
      {name: 'with-middleware-disabled-in-pathModule', url: '/v3/users/asdf?name=fred',
          expectedStatus: 200, expectedBody: {id: 'asdf', name: 'fred'}},
      {name: 'with-middleware-disabled-in-the-apiDoc', url: '/v3/users/asdf?name=fred',
          expectedStatus: 200, expectedBody: {id: 'asdf', name: 'fred'}}
    ].forEach(function(test) {
      describe(test.name, function() {
        var app = require('./sample-projects/' + test.name + '/app.js');

        it('should meet expectations', function(done) {
          request(app)
            .get(test.url)
            .expect(test.expectedStatus)
            .end(function(err, res) {
              expect(res.body).to.eql(test.expectedBody);
              done(err);
            });
        });
      });
    });

    [
      // disable response validation
      {name: 'with-response-validation-middleware-disabled-in-methodDoc',
          url: '/v3/users/34?name=fred', expectedStatus: 200, expectedBody: true},
      {name: 'with-response-validation-middleware-disabled-in-pathItem',
          url: '/v3/users/34?name=fred', expectedStatus: 200, expectedBody: true},
      {name: 'with-response-validation-middleware-disabled-in-pathModule',
          url: '/v3/users/34?name=fred', expectedStatus: 200, expectedBody: true},
      {name: 'with-response-validation-middleware-disabled-in-the-apiDoc',
          url: '/v3/users/34?name=fred', expectedStatus: 200, expectedBody: true}
    ].forEach(function(test) {
      describe(test.name, function() {
        var app = require('./sample-projects/' + test.name + '/app.js');

        it('should not expose res.validateResponse in the app', function(done) {
          request(app)
            .get(test.url)
            .expect(test.expectedStatus)
            .end(function(err, res) {
              expect(res.body).to.eql(test.expectedBody);
              done(err);
            });
        });
      });
    });
  });
});
