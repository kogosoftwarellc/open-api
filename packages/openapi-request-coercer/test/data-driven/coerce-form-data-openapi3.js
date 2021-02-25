module.exports = {
  args: {
    parameters: [],
    requestBody: {
      required: true,
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
            properties: {
              intField: {
                type: 'integer',
              },
              boolField: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
  },

  request: {
    method: 'post',
    path: '/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      intField: '100',
      boolField: 'false',
    },
  },

  headers: null,

  params: null,

  query: null,

  body: {
    intField: 100,
    boolField: false,
  },
};
