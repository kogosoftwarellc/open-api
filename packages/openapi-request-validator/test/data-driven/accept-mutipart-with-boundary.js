module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a multipart',
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              files: {
                type: 'array',
                items: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
    },
  },
  request: {
    body: {
      files: [],
    },
    headers: {
      'content-type':
        'multipart/form-data; boundary=----WebKitFormBoundaryWyK9kAU7d35AKf26',
    },
  },
};
