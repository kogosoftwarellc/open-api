module.exports = {
  parameters: [
    {
      in: 'path',
      name: 'foo',
      required: true,
      nullable: true,
      type: 'string',
    },
  ],
  outputSchema: {
    path: {
      properties: {
        foo: {
          anyOf: [
            {
              type: 'string',
            },
            {
              type: 'null',
            },
          ],
        },
      },
      required: ['foo'],
    },
  },
};
