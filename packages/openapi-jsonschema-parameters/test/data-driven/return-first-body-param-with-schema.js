module.exports = {
  parameters: [
    {
      in: 'body',
      name: 'wowow',
    },

    {
      in: 'body',
      name: 'cow',
      schema: {
        $ref: 'foo',
      },
    },

    {
      in: 'body',
      name: 'frrrrr',
    },

    {
      in: 'body',
      name: 'zzzz',
      schema: {
        $ref: 'foo',
      },
    },
  ],

  outputSchema: {
    body: {
      $ref: 'foo',
    },
  },
};
