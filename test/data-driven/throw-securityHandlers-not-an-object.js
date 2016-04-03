var expect = require('chai').expect;

module.exports = {
  constructorError: /express-openapi-security: securityHandlers must be an object/,
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

  securityHandlers: true,

  operationSecurity: [
    {
      keyScheme: ['write'],
      passwordScheme: ['write']
    },
    {
      keyScheme1: ['write'],
      passwordScheme1: ['write']
    }
  ],

  expectationMiddleware: function(req, res, next) {
    expect(req.user).to.be.ok;
    next();
  },

  expectedStatusCode: 200,
  expectedResponse: '"woo"',

};
