module.exports = {
  path: '/',
  headers: null,

  constructorArgs: {
    securityDefinitions: {
      keyScheme: {
        type: 'apiKey',
        name: 'api_key',
        in: 'header',
      },
      passwordScheme: {
        type: 'basic',
      },
    },

    securityHandlers: {
      keyScheme: function (req, scopes, securityDefinition) {
        return false;
      },
    },

    operationSecurity: [
      {
        keyScheme: ['write'],
      },
    ],
  },

  expectedError: {
    errorCode: 'authentication.openapi.security',
    message: 'No security handlers returned an acceptable response: keyScheme',
    status: 401,
  },

  expectedResult: false,
};
