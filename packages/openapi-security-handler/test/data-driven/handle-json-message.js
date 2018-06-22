var expectedError = {
  status: 403,
  message: {a:1}
};

module.exports = {
  path: '/',
  headers: null,

  constructorArgs: {
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
        cb(expectedError, false);
      }
    },

    operationSecurity: [
      {
        keyScheme: ['write']
      }
    ],
  },

  expectedError: expectedError,
  expectedResult: false
};
