// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  delete: function(req, res, next) {
    // Showing how to validate responses
    var validationError = res.validateResponse(204, null);

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

module.exports.delete.apiDoc = {
  description: 'Delete users.',
  operationId: 'deleteUsers',
  tags: ['users'],
  parameters: [],
  responses: {
    204: {
      description: 'Users were successfully deleted.'
      // 204 should not return a body so not defining a schema.  This adds an implicit
      // schema of {"type": "null"}.
    }
  }
};

// showing that if parameters are empty, express-openapi adds no input middleware.
// response middleware is always added.
module.exports.post.apiDoc = {
  description: 'Create a new user.',
  operationId: 'createUser',
  tags: ['users', 'creating'],
  parameters: [],
  responses: {
    default: {
      $ref: '#/definitions/Error'
    }
  }
};
