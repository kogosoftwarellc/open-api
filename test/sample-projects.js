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

    it('should wire up routes with defaults and coercion', function(done) {
      request(app)
        .get('/v3/users/34?name=fred')
        .expect(200, {id: 34, name: 'fred', age: 80}, done);
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
});
