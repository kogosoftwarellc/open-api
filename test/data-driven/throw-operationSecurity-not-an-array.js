var expect = require('chai').expect;

module.exports = {
  constructorError: /express-openapi-security: operationSecurity must be an Array/,
  path: '/',
  headers: null,

  securityDefinitions: {
    keyScheme: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header'
    },
    keyScheme1: {
      type: 'apiKey',
      name: 'api_key1',
      in: 'header'
    },
    keyScheme2: {
      type: 'apiKey',
      name: 'api_key2',
      in: 'header'
    }
  },

  securityHandlers: {
    keyScheme: function(req, scopes, securityDefinition, cb) {
      cb(null, false);
    },
    passwordScheme: function(req, scopes, securityDefinition, cb) {
      cb(null, false);
    },

    keyScheme1: function(req, scopes, securityDefinition, cb) {
      req.user = {name: 'fred'};
      cb(null, true);
    },
    passwordScheme1: function(req, scopes, securityDefinition, cb) {
      cb(null, true);
    }

  },

  operationSecurity: true,

  expectationMiddleware: function(req, res, next) {
    expect(req.user).to.be.ok;
    next();
  },

  expectedStatusCode: 200,
  expectedResponse: '"woo"',

};
