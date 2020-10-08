module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            properties: {
              foo: {
                type: 'string',
                readOnly: true,
              },
              bar: {
                type: 'string',
              },
            },
            required: ['foo', 'bar'],
          },
        },
      },
    },
    componentSchemas: {},
  },
  request: {
    body: {
      bar: 'asdf',
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
