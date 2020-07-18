module.exports = {
  args: {
    parameters: [
      {
        in: 'query',
        schema: {
          type: 'array',
          items: {
            schema: {
              type: 'object',
              // optional format property not passed meaning the default coercer will kick in
            },
          },
        },
        name: 'include',
        required: false,
      },
      {
        in: 'query',
        schema: {
          type: 'object',
          // optional format property not passed meaning the default coercer will kick in
        },
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
    },
  },

  query: {
    include: [
      JSON.stringify({ association: 'lines', include: ['status'] }),
      JSON.stringify({ association: 'people', include: ['hairColor'] }),
    ],
    query: JSON.stringify({ where: { $status: 2 } }),
  },
};
