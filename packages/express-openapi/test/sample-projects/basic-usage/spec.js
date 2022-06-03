var app;
var request = require('supertest');

before(async function () {
  app = await require('./app.js')();
});

module.exports = () => request(app);
