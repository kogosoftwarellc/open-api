module.exports = {
  args: {
    enableObjectCoercion: true,
    parameters: [
      {
        in: 'query',
        schema: {
          type: 'object',
          properties: {
            number: { type: 'number' },
            string: { type: 'string' },
          },
        },
        style: 'deepObject',
        name: 'deepObject',
        required: false,
      },
      {
        in: 'query',
        schema: {
          type: 'object',
          additionalProperties: {
            type: 'number',
          },
        },
        style: 'deepObject',
        name: 'additionalProperties',
        required: false,
      },
      {
        in: 'query',
        schema: {
          type: 'array',
          items: {
            schema: {
              type: 'object',
            },
          },
        },
        // style property not passed meaning the default coercer will kick in
        name: 'include',
        required: false,
      },
      {
        in: 'query',
        schema: {
          type: 'object',
        },
        // style property not passed meaning the default coercer will kick in
        name: 'query',
        required: false,
      },
    ],
  },

  request: {
    query: {
      include: [
        JSON.stringify({ association: 'lines', include: ['status'] }),
        JSON.stringify({ association: 'people', include: ['hairColor'] }),
      ],
      query: JSON.stringify({ where: { $status: 2 } }),
      deepObject: { number: '3', string: '3' },
      additionalProperties: {
        width: '1',
        length: '2',
      },
    },
  },

  query: {
    include: [
      { association: 'lines', include: ['status'] },
      { association: 'people', include: ['hairColor'] },
    ],
    query: { where: { $status: 2 } },
    deepObject: { number: 3, string: '3' },
    additionalProperties: { width: 1, length: 2 },
  },
};
