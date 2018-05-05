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
      cb({
        status: 401
      }, false);
    }
  },

  operationSecurity: [
    {
      keyScheme: ['write']
    }
  ],

  expectationMiddleware: function(req, res, next) {
    expect(req.user).to.be.ok;
    next();
  },

  expectedStatusCode: 500,
  expectedResponse: 'Challenge is a required header with 401 status codes.',
  expectedHeaders: null
};
