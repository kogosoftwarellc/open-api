module.exports = {
  parameters: [
    {
      in: 'path',
      name: 'foo',
      required: false,
      type: 'string',
    },
    {
      in: 'path',
      name: 'boo',
      required: true,
      type: 'string',
    },
  ],

  outputSchema: {
    path: {
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
