module.exports = {
  parameters: [
    {
      in: 'header',
      name: 'Accept',
      type: 'string',
      required: true,
    },

    {
      in: 'header',
      name: 'Type',
      type: 'string',
    },
  ],

  outputSchema: {
    headers: {
      properties: {
        Accept: {
          type: 'string',
        },
        Type: {
          type: 'string',
        },
      },
      required: ['Accept'],
    },
  },
};
