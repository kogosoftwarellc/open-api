module.exports = {
  parameters: [
    {
      in: 'body',
      name: 'wowow',
      nullable: true,
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
