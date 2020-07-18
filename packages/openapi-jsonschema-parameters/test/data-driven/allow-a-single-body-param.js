module.exports = {
  parameters: [
    {
      in: 'body',
      name: 'wowow',
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
