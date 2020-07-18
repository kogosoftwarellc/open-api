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
          status: 403,
          message: 'afafaf',
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
    message: 'afafaf',
    status: 403,
  },
  expectedResult: false,
};
