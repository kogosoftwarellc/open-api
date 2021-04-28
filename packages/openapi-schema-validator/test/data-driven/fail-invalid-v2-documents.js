module.exports = {
  constructorArgs: {
    version: 2,
  },

  apiDoc: {
    info: {
      title: 'Some valid API document',
      version: '1.0.0',
    },
    paths: {},
  },

  errors: [
    {
      instancePath: '',
      keyword: 'required',
      message: "must have required property 'swagger'",
      params: {
        missingProperty: 'swagger',
      },
      schemaPath: '#/required',
    },
  ],
};
