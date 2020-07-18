var app;
var request = require('supertest');

before(function () {
  app = require('./app.js');
});

module.exports = () => request(app);
