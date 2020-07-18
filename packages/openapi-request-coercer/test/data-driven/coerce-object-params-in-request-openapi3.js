module.exports = {
  args: {
    enableObjectCoercion: true,
    parameters: [
      {
        in: 'query',
        schema: {
          type: 'array',
          items: {
            schema: {
              type: 'object',
              // optional format property not passed meaning default coercer will kick in
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
    query: {
      where: {
        $status: 2,
      },
    },
  },
};
