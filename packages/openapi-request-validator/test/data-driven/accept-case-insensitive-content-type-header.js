module.exports = {
  validateArgs: {
    properties: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/TestBody',
          },
        },
      },
      required: true,
    },
    componentSchemas: {
      TestBody: {
        properties: {
          foo: {
            type: 'string',
          },
          bar: {
            type: 'string',
            readOnly: true,
          },
        },
        required: ['foo'],
      },
    },
  },
  request: {
    body: {
      foo: 'foo',
    },
    headers: {
      'ConTent-TyPe': 'application/json',
    },
  },
};
