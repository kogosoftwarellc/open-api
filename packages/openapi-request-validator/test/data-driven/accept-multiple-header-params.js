module.exports = {
  validateArgs: {
    parameters: [
      {
        in: 'header',
        name: 'X-foO',
        type: 'string',
        required: true,
      },
      {
        in: 'header',
        name: 'x-yoda',
        type: 'string',
        required: true,
      },
    ],
    schemas: null,
  },
  request: {
    headers: {
      'x-foo': 'asdf',
      'X-Yoda': 'Luke',
    },
  },
};
