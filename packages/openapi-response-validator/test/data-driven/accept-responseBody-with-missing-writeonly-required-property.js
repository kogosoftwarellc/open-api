module.exports = {
  constructorArgs: {
    responses: {
      '2XX': {
        schema: {
          type: 'object',
          properties: {
            pictures: {
              type: 'array',
              items: {
                $ref: '#/definitions/picture',
              },
            },
          },
        },
      },
    },

    definitions: {
      picture: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            writeOnly: true,
          },
          url: {
            type: 'string',
            readOnly: true,
          },
        },
        required: ['content', 'url'],
      },
    },
  },

  inputStatusCode: 200,
  inputResponseBody: {
    pictures: [{ url: 'http://example.com/picture.jpg' }],
  },

  expectedValidationError: void 0,
};
