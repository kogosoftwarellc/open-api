module.exports = {
  constructorError: /operationSecurity must be an Array/,
  path: '/',
  headers: null,

  constructorArgs: {
    securityDefinitions: {
      keyScheme: {
        type: 'apiKey',
        name: 'api_key',
        in: 'header',
      },
      keyScheme1: {
        type: 'apiKey',
        name: 'api_key1',
        in: 'header',
      },
      keyScheme2: {
        type: 'apiKey',
        name: 'api_key2',
        in: 'header',
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
        cb(null, true);
        return Promise.resolve(true);
      },
    },

    operationSecurity: true,
  },
};
