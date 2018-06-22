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
  },

  expectedError: {
    status: 400,
    challenge: 'Bearer error="invalid_request"',
    message: 'foo',
  },
  expectedResult: false
};
