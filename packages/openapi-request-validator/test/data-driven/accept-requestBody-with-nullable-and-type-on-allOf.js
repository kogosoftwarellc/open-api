module.exports = {
  validateArgs: {
    parameters: [],
    requestBody: {
      description: 'a test body',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              foo: {
                allOf: [{ $ref: '#/components/schemas/MyType' }],
                type: 'string',
                nullable: true,
              },
            },
          },
        },
      },
    },
    schemas: {
      MyType: {
        pattern: "^[A-Za-z0-9\\u00C0-÷\\u017F\\s!'¿¡@$€_+=\\-;:/.,?>)(<[]*$",
      },
    },
  },
  request: {
    body: {
      foo: null,
    },
    headers: {
      'content-type': 'application/json',
    },
  },
};
