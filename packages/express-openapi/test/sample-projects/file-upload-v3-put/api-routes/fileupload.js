module.exports = {
  put: function(req, res, next) {
    res.status(200).json({});
  }
};

module.exports.put.apiDoc = {
  summary: "PUT file upload.",
  operationId: 'PutDraftFileUpload',

  tags: ['Drafts'],

  requestBody: {
    description: 'The binary asset data.',
    required: true,
    content: {
      '*/*': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },

  responses: {
    200: {
      description: 'OK'
    },
    400: {
      description: 'BAD'
    }
  }
};
