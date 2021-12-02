const expect = require('chai').expect;
const request = require('supertest');
let app;

before(function () {
  app = require('./app.js');
});

it('should return the correct operationDoc for getFoo', () => {
  const expectedDoc = {
    operationId: 'getFoo',
    responses: {
      default: {
        description: 'return foo',
        schema: {},
      },
    },
  };

  request(app)
    .get('/foo')
    .expect(200)
    .end(function (err, res) {
      expect(res.body).to.eql(expectedDoc);
    });
});

it('should return the correct operation doc for getFooTwo', () => {
  const expectedDoc = {
    operationId: 'getFooTwo',
    responses: {
      default: {
        description:
          'same controller mounted on another path with different operationId',
        schema: {},
      },
    },
  };
  request(app)
    .get('/foo-two')
    .expect(200)
    .end(function (err, res) {
      expect(res.body).to.eql(expectedDoc);
    });
});
