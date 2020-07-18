module.exports = {
  validateArgs: {
    loggingKey: 'express-openapi-validation',
    parameters: [],
    customFormats: {
      foo: 'asdf',
    },
  },
  request: {},
  constructorError: /args.customFormats properties must be functions/,
};
