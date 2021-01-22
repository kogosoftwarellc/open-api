module.exports = {
  constructorArgs: {
    responses: {
      '2XX': {
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

    components: {
      schemas: {
        MyType: {
          pattern: "^[A-Za-z0-9\\u00C0-÷\\u017F\\s!'¿¡@$€_+=\\-;:/.,?>)(<[]*$",
        },
      },
    },
  },

  inputStatusCode: 200,
  inputResponseBody: {
    foo: null,
  },

  expectedValidationError: void 0,
};
