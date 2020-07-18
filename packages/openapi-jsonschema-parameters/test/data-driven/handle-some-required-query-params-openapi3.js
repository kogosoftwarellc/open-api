module.exports = {
  parameters: [
    {
      in: 'query',
      name: 'foo',
      required: false,
      schema: {
        type: 'string',
      },
    },
    {
      in: 'query',
      name: 'boo',
      required: true,
      schema: {
        type: 'string',
      },
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
