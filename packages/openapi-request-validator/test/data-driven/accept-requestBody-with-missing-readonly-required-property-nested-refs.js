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
        allOf: [
          {
            $ref: '#/components/schemas/Test2',
          },
          {
            properties: {
              bar: {
                type: 'string',
              },
            },
            required: ['bar'],
          },
        ],
      },
      Test2: {
        allOf: [
          {
            $ref: '#/components/schemas/Test3',
          },
          {
            properties: {
              foo: {
                type: 'string',
                readOnly: true,
              },
            },
            required: ['foo'],
          },
        ],
      },
      Test3: {
        type: 'object',
        properties: {
          baz: {
            type: 'string',
            readOnly: true,
          },
        },
        required: ['baz'],
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
