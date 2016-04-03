var expect = require('chai').expect;

module.exports = {
  path: '/',
  headers: null,

  securityDefinitions: {
    keyScheme: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header'
    },
    passwordScheme: {
      type: 'basic'
    }
  },

  securityHandlers: {
    keyScheme: function(req, scopes, securityDefinition, cb) {
      cb(null, false);
    },
    passwordScheme: function(req, scopes, securityDefinition, cb) {
      req.user = {name: 'fred'};
      cb(null, true);
    }
  },

  operationSecurity: [
    {
      keyScheme: ['write']
    },
    {
      passwordScheme: ['write']
    }
  ],

  expectationMiddleware: function(req, res, next) {
    expect(req.user).to.be.ok;
    next();
  },

  expectedStatusCode: 200,
  expectedResponse: '"woo"',

};
