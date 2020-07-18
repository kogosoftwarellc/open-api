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
  request: {
    body: {
      bar: 'asdf',
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
