module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Test1',
          },
        },
      },
    },
    componentSchemas: {
      Test1: {
        properties: {
          foo: {
            type: 'string',
          },
        },
        required: ['foo'],
      },
    },
  },
  request: {
    body: {
      foo: 'asdf',
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
