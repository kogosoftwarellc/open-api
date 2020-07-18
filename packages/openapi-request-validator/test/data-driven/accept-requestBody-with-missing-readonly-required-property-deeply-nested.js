module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Test',
          },
        },
      },
    },
    componentSchemas: {
      Test: {
        properties: {
          obj: {
            type: 'object',
            properties: {
              refbar: {
                $ref: '#/components/schemas/Test',
              },
              refitems: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Test',
                },
              },
              bar: {
                type: 'string',
              },
              foo: {
                type: 'string',
                readOnly: true,
              },
              baz: {
                type: 'object',
                properties: {
                  bar: {
                    type: 'string',
                  },
                  foo: {
                    type: 'string',
                    readOnly: true,
                  },
                },
                required: ['bar', 'foo'],
              },
            },
            required: ['bar', 'foo'],
          },
          baz: {
            type: 'string',
            readOnly: true,
          },
        },
        required: ['obj', 'baz'],
      },
    },
  },
  request: {
    body: {
      obj: {
        bar: 'asdf',
      },
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
