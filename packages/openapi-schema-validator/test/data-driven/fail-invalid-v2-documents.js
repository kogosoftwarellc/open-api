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
      dataPath: '',
      keyword: 'required',
      message: "should have required property 'swagger'",
      params: {
        missingProperty: 'swagger',
      },
      schemaPath: '#/required',
    },
  ],
};
