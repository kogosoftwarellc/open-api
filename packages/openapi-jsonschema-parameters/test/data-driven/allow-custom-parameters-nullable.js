module.exports = {
  parameters: [
    {
      in: 'query',
      name: 'search',
      type: 'string',
      'x-custom': 'value',
      nullable: true,
    },
  ],

  outputSchema: {
    query: {
      properties: {
        search: {
          anyOf: [
            {
              type: 'string',
              'x-custom': 'value',
            },
            {
              type: 'null',
            },
          ],
        },
      },
      required: [],
    },
  },
};
