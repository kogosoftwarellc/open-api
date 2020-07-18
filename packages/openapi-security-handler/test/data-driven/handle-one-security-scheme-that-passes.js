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
        req.user = { name: 'fred' };
        return Promise.resolve(true);
      },
      passwordScheme: function (req, scopes, securityDefinition) {
        req.user = { name: 'fred' };
        return Promise.resolve(true);
      },
    },

    operationSecurity: [
      {
        keyScheme: ['write'],
      },
      {
        passwordScheme: ['write'],
      },
    ],
  },

  expectedError: void 0,
  expectedResult: true,
  expectedUser: { name: 'fred' },
};
