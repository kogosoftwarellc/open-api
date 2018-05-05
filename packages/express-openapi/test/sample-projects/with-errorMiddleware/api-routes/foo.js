module.exports = {
  get: function(req, res, next) {
    next(new Error('hello from /v3/foo'));
  }
};

module.exports.get.apiDoc = {
  description: 'Get foo.',
  operationId: 'getFoo',
  parameters: [],
  responses: {
    200: {
      description: 'testing error handler',
      schema: {
        $ref: '#/definitions/Foo'
      }
    }
  }
};
