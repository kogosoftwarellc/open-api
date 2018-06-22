module.exports = {
  path: '/',
  headers: null,

  constructorArgs: {
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
  },

  expectedError: {
    status: 403,
    challenge: 'Bearer error="insufficient_scope"',
    message: 'foo'
  },
  expectedResult: false
};
