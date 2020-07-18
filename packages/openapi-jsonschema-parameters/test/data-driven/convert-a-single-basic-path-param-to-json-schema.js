module.exports = {
  parameters: [
    {
      in: 'path',
      name: 'foo',
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
      },
      required: ['foo'],
    },
  },
};
