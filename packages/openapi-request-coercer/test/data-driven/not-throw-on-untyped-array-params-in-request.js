module.exports = {
  logs: [
    {
      type: 'WARN',
      message: '',
      optionalParams: [
        "No type has been defined. A default 'identity' strategy has been set.",
      ],
    },
  ],

  args: {
    enableObjectCoercion: true,
    parameters: [
      {
        in: 'query',
        type: 'array',
        name: 'multi-valued',
        items: {
          // Missing type member here...
          // although this is recommended by the Swagger 2.0 spec
          // (cf. https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject)
          // this is not enforced by the schema
          // (cf. https://github.com/OAI/OpenAPI-Specification/blob/7ce374d67e46e2fdf0da49fc6e29f6854985627e/schemas/v2.0/schema.json#L1108-L1176)
          enum: ['one', 'two'],
        },
        collectionFormat: 'multi',
        required: false,
      },
    ],
  },

  request: {
    query: {
      'multi-valued': 'one',
    },
  },

  query: {
    'multi-valued': ['one'],
  },
};
