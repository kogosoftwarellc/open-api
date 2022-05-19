var app;
var request = require('supertest');

before(async function () {
  app = await require('./app.js')();
});

it('should work', () => {
  request(app)
})
