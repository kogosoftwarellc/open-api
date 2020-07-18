module.exports = {
  parameters: [
    {
      in: 'path',
      name: 'foo',
      required: true,
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
      required: ['foo', 'boo'],
    },
  },
};
