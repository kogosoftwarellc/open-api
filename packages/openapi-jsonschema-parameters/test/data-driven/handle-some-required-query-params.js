module.exports = {
  parameters: [
    {
      in: 'query',
      name: 'foo',
      required: false,
      type: 'string',
    },
    {
      in: 'query',
      name: 'boo',
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
        boo: {
          type: 'string',
        },
      },
      required: ['boo'],
    },
  },
};
