// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  del: function (ctx, next) {
    // Showing how to validate responses
    var validationError = ctx.state.validateResponse(204, null);

    if (validationError) {
      throw validationError;
    }

    ctx.status = 204;
  },
  get: [
    function (ctx, next) {
      ctx.status = 200;
      ctx.body = [{ name: 'fred' }];
    },
  ],

  post: function (ctx, next) {
    ctx.throw();
  },
};

module.exports.del.apiDoc = {
  description: 'Delete users.',
  operationId: 'deleteUsers',
  tags: ['users'],
  parameters: [],
  responses: {
    204: {
      description: 'Users were successfully deleted.',
      // 204 should not return a body so not defining a schema.  This adds an implicit
      // schema of {"type": "null"}.
    },
  },
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
      description: 'Unexpected error',
      schema: {
        $ref: '#/definitions/Error',
      },
    },
  },
};
