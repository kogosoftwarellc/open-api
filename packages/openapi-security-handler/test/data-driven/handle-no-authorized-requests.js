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
        keyScheme: ['write'],
        keyScheme1: ['write'],
      },
      {
        keyScheme2: ['write'],
        keyScheme1: ['write'],
      },
    ],
  },

  expectedError: {
    status: 401,
    message:
      'No security handlers returned an acceptable response: keyScheme AND keyScheme1 OR keyScheme2 AND keyScheme1',
    errorCode: 'authentication.openapi.security',
  },
  expectedResult: false,
};
