var expect = require('chai').expect;

module.exports = {
  path: '/',
  headers: null,

  securityDefinitions: {
    keyScheme: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header'
    }
  },

  securityHandlers: {
    keyScheme: function(req, scopes, securityDefinition, cb) {
      cb({
        status: 403,
        challenge: 'Bearer error="insufficient_scope"',
        message: 'foo'
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

  expectedStatusCode: 403,
  expectedResponse: 'foo',
  expectedHeaders: {
    'www-authenticate': 'Bearer error="insufficient_scope"'
  }
};
