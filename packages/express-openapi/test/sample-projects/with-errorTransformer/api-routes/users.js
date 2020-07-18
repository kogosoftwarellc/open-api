// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  get: [
    function (req, res, next) {
      res.status(200).json([{ name: 'fred' }]);
    },
  ],

  post: function (req, res, next) {
    res.status(500).json({});
  },
};

// showing that if parameters are empty, express-openapi adds no middleware
module.exports.post.apiDoc = {
  description: 'asdf',
  parameters: [],
  responses: {
    default: {
      description: 'Unexpected error',
      schema: {
        $ref: '#/definitions/Error',
      },
    },
  },
};
