module.exports = {
  constructorError: /securityHandlers must be an object/,
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

    securityHandlers: true,

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
