module.exports = {
  args: {
    parameters: [
      {
        name: 'If-None-Match',
        in: 'header',
        description: '...',
        schema: { type: 'array', items: { type: 'string' } },
      },
    ],
  },

  request: {
    headers: {
      'If-None-Match': '"123","321"',
    },
  },

  headers: {
    'If-None-Match': ['"123"', '"321"'],
  },
};
