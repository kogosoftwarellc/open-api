const customToString = () => 'Hello world';

module.exports = {
  args: {
    // We're not coercing any params, but there has to be at least one present for the functionality to kick in
    parameters: [
      {
        in: 'path',
        name: 'path1',
        type: 'boolean',
      },
    ],
  },

  request: {
    body: {
      toString: customToString,
    },
  },

  body: {
    toString: customToString,
  },
};
