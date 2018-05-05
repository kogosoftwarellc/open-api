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
  expectedResponse: 'Bad request.',
  expectedHeaders: {
  }
};
