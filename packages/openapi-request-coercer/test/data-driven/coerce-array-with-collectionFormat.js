module.exports = {
  args: {
    parameters: [
      {
        in: 'formData',
        name: 'csv',
        type: 'array',
        items: {
          type: 'string',
        },
        collectionFormat: 'csv',
      },

      {
        in: 'formData',
        name: 'ssv',
        type: 'array',
        items: {
          type: 'string',
        },
        collectionFormat: 'ssv',
      },

      {
        in: 'formData',
        name: 'tsv',
        type: 'array',
        items: {
          type: 'string',
        },
        collectionFormat: 'tsv',
      },

      {
        in: 'formData',
        name: 'pipes',
        type: 'array',
        items: {
          type: 'string',
        },
        collectionFormat: 'pipes',
      },
    ],
  },

  request: {
    method: 'post',
    path: '/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      csv: 'foo,bar',
      ssv: 'foo bar',
      tsv: 'foo\tbar',
      pipes: 'foo|bar',
    },
  },

  headers: null,

  params: null,

  query: null,

  body: {
    csv: ['foo', 'bar'],
    ssv: ['foo', 'bar'],
    tsv: ['foo', 'bar'],
    pipes: ['foo', 'bar'],
  },
};
