module.exports = {
  logs: [
    {
      type: 'WARN',
      message: '',
      optionalParams: [
        "No proper coercion strategy has been found for type 'asdfasdf'. A default 'identity' strategy has been set.",
      ],
    },
    {
      type: 'WARN',
      message: '',
      optionalParams: [
        "No proper coercion strategy has been found for type 'dddd'. A default 'identity' strategy has been set.",
      ],
    },
  ],

  args: {
    parameters: [
      {
        in: 'path',
        name: 'path1',
        schema: {
          type: 'asdfasdf',
        },
      },

      {
        in: 'path',
        name: 'path2',
        schema: {
          type: 'dddd',
        },
      },
    ],
  },

  request: {
    path: '/5/6.35',
    params: {
      path1: '5',
      path2: '6.35',
    },
    headers: null,
  },

  headers: null,

  params: {
    path1: '5',
    path2: '6.35',
  },

  query: null,
};
