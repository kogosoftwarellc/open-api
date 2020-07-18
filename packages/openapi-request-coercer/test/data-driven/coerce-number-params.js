module.exports = {
  args: {
    parameters: [
      {
        in: 'query',
        name: 'number1',
        type: 'number',
      },

      {
        in: 'query',
        name: 'number2',
        type: 'number',
      },

      {
        in: 'query',
        name: 'integer1',
        type: 'integer',
      },

      {
        in: 'query',
        name: 'integer2',
        type: 'integer',
      },
    ],
  },

  request: {
    query: {
      number1: '1',
      number2: 'abc',
      integer1: '2',
      integer2: 'def',
    },
    headers: null,
  },

  headers: null,

  query: {
    number1: 1,
    number2: 'abc',
    integer1: 2,
    integer2: 'def',
  },
};
