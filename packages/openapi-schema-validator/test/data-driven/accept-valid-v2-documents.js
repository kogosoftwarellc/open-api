module.exports = {
  // it should handle empty constructorArgs and default to version 2
  constructorArgs: null,

  apiDoc: {
    swagger: '2.0',
    info: {
      title: 'Some valid API document',
      version: '1.0.0'
    },
    definitions: {
      User: {
        properties: {
          name: {
            type: 'string'
          }
        }
      }
    },
    paths: {}
  },

  errors: []
};
