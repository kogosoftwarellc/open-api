module.exports = {
  args: {
    parameters: [
      {
        in: 'formData',
        name: 'data1',
        type: 'array',
        items: {
          type: 'string'
        },
        collectionFormat: 'csv'
      },

      {
        in: 'formData',
        name: 'data2',
        type: 'integer'
      }
    ]
  },

  requestMethod: 'post',

  requestPath: '/',

  requestHeaders: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },

  requestBody: 'data1=foo,bar&data2=5',

  headers: null,

  params: null,

  query: null,

  body: {
    data1: ['foo', 'bar'],
    data2: 5
  }
};
