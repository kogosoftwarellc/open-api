var expect = require('chai').expect;
var expectedApiDoc = require('../fixtures/basic-usage-api-doc-after-initialization.json');

module.exports = function(request) {
  it('should expose <apiDoc>.basePath/api-docs', function(done) {
    request()
      .get('/v3/api-docs')
      .set("Host", "test-host")
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.eql(expectedApiDoc);
        done(err);
      });
  });

  it('should add response validation middleware when parameters are empty', function(done) {
    request()
      .delete('/v3/users')
      .expect(204, '', done);
  });

  it('should use defaults, coercion, and operation parameter overriding', function(done) {
    request()
      .get('/v3/users/34?name=fred')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.eql({id: 34, name: 'fred', age: 80});
        done(err);
      });
  });

  it('should validate input', function(done) {
    request()
      .get('/v3/users/34?name=barney')
      .expect(400, {errors: [
        {
          errorCode: 'pattern.openapi.requestValidation',
          location: 'query',
          message: 'must match pattern \"^fred$\"',
          path: 'name'
        }
      ], status: 400}, done);
  });

  it('should use path parameters', function(done) {
    request()
      .post('/v3/users/34')
      .send({name: 'fred'})
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.eql({id: '34'});
        done(err);
      });
  });

  it('should add apiDoc to req', function(done) {
    request()
      .get('/v3/apiDocs?type=apiDoc')
      .expect(200)
      .end(function(err, result) {
        expect(result.body).to.eql(expectedApiDoc);
        done(err);
      });
  });

  it('should add operationDoc to req', function(done) {
    request()
      .get('/v3/apiDocs?type=operationDoc')
      .expect(200)
      .end(function(err, result) {
        expect(result.body.operationId).to.equal('getApiDoc');
        done(err);
      });
  });

  it('should dereference #/definitions/ for validation', function(done) {
    var user = {};

    request()
      .post('/v3/users/34?name=barney')
      .send(user)
      .expect(400, {errors: [
        {
          errorCode: 'required.openapi.requestValidation',
          location: 'body',
          message: 'must have required property \'name\'',
          path: 'name'
        }
      ], status: 400}, done);
  });
};
