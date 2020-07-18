module.exports = {
  parameters: [
    {
      in: 'query',
      name: 'search',
      type: 'string',
      'x-custom': 'value',
    },
  ],

  outputSchema: {
    query: {
      properties: {
        search: {
          type: 'string',
          'x-custom': 'value',
        },
      },
      required: [],
    },
  },
};
