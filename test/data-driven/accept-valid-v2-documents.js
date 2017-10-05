module.exports = {
  validator: 2,
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
