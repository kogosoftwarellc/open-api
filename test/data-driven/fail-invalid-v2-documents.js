module.exports = {
  validator: 2,
  apiDoc: {
    info: {
      title: 'Some valid API document',
      version: '1.0.0'
    },
    paths: {}
  },
  errors: [
    {
      property: 'instance',
      message: 'requires property "swagger"',
      schema: 'http://swagger.io/v2/schema.json#',
      instance: {
        info: {
          title: 'Some valid API document',
          version: '1.0.0'
        },
        paths: {}
      },
      name: 'required',
      argument: 'swagger',
      stack: 'instance requires property "swagger"'
    }
  ]
};
