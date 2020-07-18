module.exports = {
  constructorArgs: {
    version: 2,
    extensions: {
      definitions: {
        schema: {
          properties: {
            oneOf: {
              type: 'array',
              minItems: 1,
              items: {
                $ref: '#/definitions/schema',
              },
            },
          },
        },
      },
    },
  },

  apiDoc: {
    swagger: '2.0',
    info: {
      title: 'Some valid API document',
      version: '1.0.0',
    },
    definitions: {
      User: {
        properties: {
          name: {
            oneOf: [{ type: 'string' }, { type: 'null' }],
          },
        },
      },
    },
    paths: {},
  },

  errors: [],
};
