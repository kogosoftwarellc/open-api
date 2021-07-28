module.exports = {
  validateArgs: {
    enableHeadersLowercase: false,
    parameters: [
      {
        in: 'header',
        name: 'X-foO',
        type: 'string',
        required: true,
      },
    ],
    schemas: null,
  },
  request: {
    headers: {
      'X-foO': 'asdf',
    },
  },
};
