module.exports = {
  parameters: [
    {
      in: 'query',
      name: 'foo',
      required: true,
      nullable: true,
      type: 'string',
    },
  ],
  outputSchema: {
    query: {
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
