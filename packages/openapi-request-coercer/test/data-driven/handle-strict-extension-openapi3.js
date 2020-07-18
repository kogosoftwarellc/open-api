module.exports = {
  args: {
    extensionBase: 'x-foo-coercion',
    parameters: [
      {
        in: 'path',
        name: 'path0',
        schema: {
          type: 'boolean',
        },
        'x-foo-coercion-strict': true,
      },

      {
        in: 'path',
        name: 'path1',
        schema: {
          type: 'boolean',
        },
        'x-foo-coercion-strict': true,
      },

      {
        in: 'path',
        name: 'path2',
        schema: {
          type: 'boolean',
        },
        'x-foo-coercion-strict': true,
      },
    ],
  },

  request: {
    path: '/true/TRUE/FALSE',
    params: {
      path0: true,
      path1: 'true',
      path2: 'false',
    },
    query: {},
    headers: null,
  },

  headers: null,

  params: {
    path0: true,
    path1: true,
    path2: false,
  },

  query: {},
};
