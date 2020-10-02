module.exports = {
  parameters: [
    {
      in: 'cookie',
      name: 'Accept',
      type: 'string',
      required: true,
    },

    {
      in: 'cookie',
      name: 'Type',
      type: 'string',
    },
  ],

  outputSchema: {
    cookie: {
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
