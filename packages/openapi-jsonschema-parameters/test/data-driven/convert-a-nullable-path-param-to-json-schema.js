module.exports = {
  parameters: [
    {
      in: 'path',
      name: 'foo',
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
      required: [],
    },
  },
};
