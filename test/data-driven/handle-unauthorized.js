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
    keyScheme1: function(req, scopes, securityDefinition, cb) {
      cb(null, false);
    },
    keyScheme2: function(req, scopes, securityDefinition, cb) {
      cb(null, false);
    }
  },

  operationSecurity: [
    {
      keyScheme: ['write'],
      keyScheme1: ['write']
    },
    {
      keyScheme2: ['write'],
      keyScheme1: ['write']
    }
  ],

  expectationMiddleware: function(req, res, next) {
    expect(req.user).to.be.ok;
    next();
  },

  expectedStatusCode: 401,
  expectedResponse: JSON.stringify({
    status: 401,
    message: 'Failed to authorize against keyScheme AND keyScheme1 OR keyScheme2 AND keyScheme1',
    errorCode: 'express-openapi.authentication'
  })
};
