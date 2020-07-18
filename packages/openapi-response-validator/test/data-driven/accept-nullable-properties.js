module.exports = {
  constructorArgs: {
    responses: {
      '200': {
        description: 'Ok',
        schema: {
          type: 'object',
          properties: {
            msisdn: {
              type: 'string',
            },
            countryId: {
              type: 'string',
              nullable: true,
            },
          },
          required: ['msisdn'],
        },
      },
    },

    definitions: null,
  },

  inputStatusCode: 200,
  inputResponseBody: { msisdn: '790000000000', countryId: null },

  expectedValidationError: void 0,
};
