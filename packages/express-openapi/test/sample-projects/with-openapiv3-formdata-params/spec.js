let app;
const expect = require('chai').expect;
const request = require('supertest');

before(async function () {
  app = await require('./app')()
})

it('should coerce the types on formData fields', function (done) {
  request(app)
    .post('/test')
    .send('name=Fred&isCool=true&age=38')
    .expect(200)
    .end(function (err, res) {
      expect(res.body).to.eql({
        name: 'Fred',
        isCool: true,
        age: 38,
      });
      done(err);
    });
});
