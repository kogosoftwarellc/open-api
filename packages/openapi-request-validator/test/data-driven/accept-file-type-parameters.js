module.exports = {
  validateArgs: {
    parameters: [
      {
        name: 'file',
        in: 'formData',
        description: 'The file to upload',
        type: 'file',
      },
    ],
    schemas: null,
  },
  request: {
    headers: {
      'x-foo': 'asdf',
    },
  },
};
