module.exports = {
  args: {
    enableObjectCoercion: true,
    parameters: [
      {
        in: 'query',
        type: 'array',
        name: 'include',
        items: {
          type: 'object',
          // optional format property not passed meaning the default coercer will kick in
        },
        required: false,
      },
      {
        in: 'query',
        type: 'object',
        name: 'query',
        required: false,
        // optional format property not passed meaning the default coercer will kick in
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
      { association: 'lines', include: ['status'] },
      { association: 'people', include: ['hairColor'] },
    ],
    query: { where: { $status: 2 } },
  },
};
