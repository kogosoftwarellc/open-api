module.exports = {
  parameters: [
    {
      in: 'query',
      name: 'foo',
      required: true,
      type: 'string',
    },
  ],

  outputSchema: {
    query: {
      properties: {
        foo: {
          type: 'string',
        },
      },
      required: ['foo'],
    },
  },
};
