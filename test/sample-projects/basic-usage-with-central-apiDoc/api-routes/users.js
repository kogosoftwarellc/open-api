// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  del: function(req, res, next) {
    // Showing how to validate responses
    const validationError = res.validateResponse(204, null);

    if (validationError) {
      return next(validationError);
    }

    res.status(204).send('').end();
  },
  get: [function(req, res, next) {
    res.status(200).json([{name: 'fred'}]);
  }],

  post: function(req, res, next) {
    res.status(500).json({});
  }
};
