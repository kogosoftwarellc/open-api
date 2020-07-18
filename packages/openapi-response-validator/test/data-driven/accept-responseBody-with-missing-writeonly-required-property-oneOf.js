module.exports = {
  constructorArgs: {
    responses: {
      '2XX': {
        schema: {
          oneOf: [
            {
              $ref: '#/definitions/picture',
            },
            {
              type: 'object',
              properties: {
                content: {
                  type: 'string',
                  writeOnly: true,
                },
                url: {
                  type: 'string',
                },
              },
              required: ['content', 'url'],
            },
          ],
        },
      },
    },

    definitions: {
      picture: {
        oneOf: [
          {
            $ref: '#/definitions/test1',
          },
          {
            type: 'object',
            properties: {
              content2: {
                type: 'string',
                writeOnly: true,
              },
              url2: {
                type: 'string',
              },
            },
            required: ['content2', 'url2'],
          },
        ],
      },
      test1: {
        type: 'object',
        properties: {
          content3: {
            type: 'string',
            writeOnly: true,
          },
          url3: {
            type: 'string',
          },
        },
        required: ['content3', 'url3'],
      },
    },
  },

  inputStatusCode: 200,
  inputResponseBody: {
    url2: 'http://example.com/picture.jpg',
  },

  expectedValidationError: void 0,
};
