module.exports = {
  validateArgs: {
    parameters: [],
  },
  requestBody: {
    content: {
      'application/foo1+json': {
        schema: {
          properties: {
            name: {
              type: 'string',
            },
          },
          required: ['name'],
        },
      },
      'application/foo2+json': {
        schema: {
          properties: {
            first_name: {
              type: 'string',
            },
            last_name: {
              type: 'string',
            },
          },
          required: ['first_name', 'last_name'],
        },
      },
    },
  },
  request: {
    headers: {
      'content-type': 'application/foo2+json',
    },
    body: {
      first_name: 'foo',
      last_name: 'bar',
    },
  },
};
