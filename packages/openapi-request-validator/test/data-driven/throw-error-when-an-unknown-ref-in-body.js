module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'body',
        name: 'foo',
        required: true,
        schema: {
          $ref: '#/definitions/TestBody',
        },
      },
    ],
  },
  request: {},
  constructorError: /can\'t resolve reference #\/definitions\/TestBody from id/,
};
