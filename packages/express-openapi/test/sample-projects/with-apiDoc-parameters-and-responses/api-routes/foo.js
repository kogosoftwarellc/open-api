module.exports = {
  parameters: [
    {
      $ref: '#/parameters/Boo'
    }
  ],
  get: function(req, res, next) {
    var statusCode = req.query.foo === 'success' ? 200 : 500;
    var errors = res.validateResponse(statusCode, req.query.boo);
    if (errors) {
      errors.status = 500;
      throw errors;
    }
  },
  // handling no method doc
  post: function() {
    return;
  }
};

module.exports.get.apiDoc = {
  description: 'Get foo.',
  operationId: 'getFoo',
  tags: ['foo'],
  parameters: [
    {
      $ref: '#/parameters/Foo'
    }
  ],
  responses: {
    200: {
      $ref: '#/responses/SuccessResponse'
    },
    default: {
      $ref: '#/responses/ErrorResponse'
    }
  }
};
