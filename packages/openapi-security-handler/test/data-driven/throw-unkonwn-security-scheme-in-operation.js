module.exports = {
  constructorError: /openapi-security: Unknown security scheme "foo" used in operation/,
  path: '/',
  headers: null,

  constructorArgs: {
    loggingKey: 'openapi-security',
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
      keyScheme1: function (req, scopes, securityDefinition) {
        return Promise.resolve(false);
      },
      keyScheme2: function (req, scopes, securityDefinition) {
        return Promise.resolve(false);
      },
    },

    operationSecurity: [
      {
        foo: ['write'],
        keyScheme1: ['write'],
      },
      {
        keyScheme2: ['write'],
        keyScheme1: ['write'],
      },
    ],
  },
};
