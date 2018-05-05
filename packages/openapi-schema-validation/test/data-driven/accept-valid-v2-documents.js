module.exports = {
  // it should default to 2
  validator: null,
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
