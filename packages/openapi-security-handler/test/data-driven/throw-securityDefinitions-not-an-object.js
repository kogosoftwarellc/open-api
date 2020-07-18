module.exports = {
  constructorError: /securityDefinitions must be an object/,
  path: '/',
  headers: null,

  constructorArgs: {
    securityDefinitions: true,

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
};
