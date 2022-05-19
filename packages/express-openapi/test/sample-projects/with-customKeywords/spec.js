var app;
var request = require('supertest');

before(async function () {
  app = await require('./app.js')();
});

describe('customKeywords', function () {
  it('should pass when the data is valid', function (done) {
    let now = new Date();
    request(app)
      .get(`/v3/coerce?milliseconds=${now.getTime()}&ignore=foo`)
      .expect(
        200,
        { isoDateString: now.toISOString(), ignoredString: 'foo' },
        done
      );
  });

  it('should fail when the data is invalid', function (done) {
    let now = new Date();
    request(app)
      .get(`/v3/coerce?milliseconds=foo&ignore=foo`)
      .expect(
        400,
        {
          errors: [
            {
              errorCode: 'x-coerce.openapi.requestValidation',
              location: 'query',
              message: 'should pass "x-coerce" keyword validation',
              path: 'milliseconds',
            },
          ],
          status: 400,
        },
        done
      );
  });
});
