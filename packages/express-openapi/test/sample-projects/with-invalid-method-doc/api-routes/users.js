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

// showing that if method doc is invalid, express-openapi throws an error.
module.exports.post.apiDoc = {
  parameters: 'asdafsdf',
};
