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

      keyScheme1: {
        type: 'apiKey',
        name: 'api_key1',
        in: 'header',
      },
      passwordScheme1: {
        type: 'basic',
      },
    },

    securityHandlers: {
      keyScheme: function (req, scopes, securityDefinition) {
        return Promise.resolve(false);
      },
      passwordScheme: function (req, scopes, securityDefinition) {
        return Promise.resolve(false);
      },

      keyScheme1: function (req, scopes, securityDefinition) {
        req.user = { name: 'fred' };
        return Promise.resolve(true);
      },
      passwordScheme1: function (req, scopes, securityDefinition) {
        return Promise.resolve(true);
      },
    },

    operationSecurity: [
      {
        keyScheme: ['write'],
        passwordScheme: ['write'],
      },
      {
        keyScheme1: ['write'],
        passwordScheme1: ['write'],
      },
    ],
  },

  expectedError: void 0,
  expectedResult: true,
  expectedUser: { name: 'fred' },
};
