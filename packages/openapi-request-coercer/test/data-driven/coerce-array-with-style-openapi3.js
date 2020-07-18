module.exports = {
  args: {
    parameters: [
      {
        in: 'header',
        name: 'headercsv',
        schema: {
          type: 'array',
          items: {
            schema: { type: 'integer' },
          },
        },
        style: 'simple',
      },

      {
        in: 'query',
        name: 'querycsv',
        schema: {
          type: 'array',
          items: {
            schema: { type: 'string' },
          },
        },
        style: 'form',
        explode: false,
      },

      {
        in: 'query',
        name: 'querymulti',
        schema: {
          type: 'array',
          items: {
            schema: { type: 'string' },
          },
        },
        style: 'form',
        explode: true,
      },

      {
        in: 'query',
        name: 'querypipe',
        schema: {
          type: 'array',
          items: {
            schema: { type: 'string' },
          },
        },
        style: 'pipeDelimited',
      },

      {
        in: 'query',
        name: 'queryspace',
        schema: {
          type: 'array',
          items: {
            schema: { type: 'string' },
          },
        },
        style: 'spaceDelimited',
      },

      {
        in: 'path',
        name: 'pathcsv',
        schema: {
          type: 'array',
          items: {
            schema: { type: 'string' },
          },
        },
        style: 'simple',
      },
    ],
  },

  request: {
    method: 'post',
    path: '/foo,bar,baz/',
    headers: {
      headercsv: '1,2,3',
    },
    params: {
      pathcsv: 'foo,bar,baz',
    },
    query: {
      querycsv: 'foo,bar',
      querymulti: ['foo', 'bar'],
      querypipe: 'pipe|delimited|array',
      queryspace: 'space delimited array',
    },
  },

  headers: {
    headercsv: [1, 2, 3],
  },

  params: {
    pathcsv: ['foo', 'bar', 'baz'],
  },

  query: {
    querycsv: ['foo', 'bar'],
    querymulti: ['foo', 'bar'],
    querypipe: ['pipe', 'delimited', 'array'],
    queryspace: ['space', 'delimited', 'array'],
  },
};
