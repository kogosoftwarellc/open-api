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
        status: 400,
        challenge: 'Bearer error="invalid_request"',
        message: 'foo',
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

  expectedStatusCode: 400,
  expectedResponse: 'foo',
  expectedHeaders: {
    'www-authenticate': 'Bearer error="invalid_request"'
  }
};
