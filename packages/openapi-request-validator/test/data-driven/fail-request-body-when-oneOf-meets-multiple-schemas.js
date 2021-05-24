module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                $ref: '#/components/schemas/Test1',
              },
              {
                properties: {
                  qux: {
                    type: 'string',
                    readOnly: true,
                  },
                  quux: {
                    type: 'string',
                  },
                },
                required: ['qux', 'quux'],
              },
            ],
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
      quux: 'asdf',
    },
    headers: {
      'content-type': 'application/json',
    },
  },

  expectedError: {
    status: 400,
    errors: [
      {
        errorCode: 'oneOf.openapi.requestValidation',
        message: 'must match exactly one schema in oneOf',
        location: 'body',
      },
    ],
  },
};
