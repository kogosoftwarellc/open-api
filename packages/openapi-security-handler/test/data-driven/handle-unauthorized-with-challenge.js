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
        throw {
          status: 401,
          challenge: 'Basic asdf',
        };
      },
    },

    operationSecurity: [
      {
        keyScheme: ['write'],
      },
    ],
  },

  expectedError: {
    status: 401,
    challenge: 'Basic asdf',
  },
  expectedResult: false,
};
