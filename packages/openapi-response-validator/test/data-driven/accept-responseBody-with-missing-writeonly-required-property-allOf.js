module.exports = {
  constructorArgs: {
    responses: {
      '2XX': {
        schema: {
          allOf: [
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
              },
              required: ['content'],
            },
          ],
        },
      },
    },

    definitions: {
      picture: {
        allOf: [
          {
            type: 'object',
            properties: {
              url: {
                type: 'string',
              },
            },
            required: ['url'],
          },
          {
            $ref: '#/definitions/test1',
          },
        ],
      },
      test1: {
        allOf: [
          {
            $ref: '#/definitions/test2',
          },
          {
            type: 'object',
            properties: {
              mimetype: {
                type: 'string',
                writeOnly: true,
              },
            },
            required: ['mimetype'],
          },
        ],
      },
      test2: {
        type: 'object',
        properties: {
          size: {
            type: 'string',
          },
        },
        required: ['size'],
      },
    },
  },

  inputStatusCode: 200,
  inputResponseBody: {
    url: 'http://example.com/picture.jpg',
    size: '2MB',
  },

  expectedValidationError: void 0,
};
