module.exports = {
  constructorError: /securityDefinitions must be an object/,
  path: '/',
  headers: null,

  constructorArgs: {
    securityDefinitions: null,

    securityHandlers: {
      keyScheme: function(req, scopes, securityDefinition, cb) {
        cb(null, false);
      },
      passwordScheme: function(req, scopes, securityDefinition, cb) {
        cb(null, false);
      },

      keyScheme1: function(req, scopes, securityDefinition, cb) {
        req.user = {name: 'fred'};
        cb(null, true);
      },
      passwordScheme1: function(req, scopes, securityDefinition, cb) {
        cb(null, true);
      }

    },

    operationSecurity: [
      {
        keyScheme: ['write'],
        passwordScheme: ['write']
      },
      {
        keyScheme1: ['write'],
        passwordScheme1: ['write']
      }
    ],
  },
};
