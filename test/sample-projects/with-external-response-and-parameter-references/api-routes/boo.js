module.exports = {
  parameters: [
    {
      $ref: '#/parameters/Boo'
    }
  ],
  get: function(req, res, next) {
    var statusCode = req.query.foo === 'success' ?
      200 :
      500;
    var errors = res.validateResponse(statusCode, req.query.boo);
    res.status(statusCode).json(errors);
  },
  // handling no method doc
  post: function() {}
};

module.exports.get.apiDoc = {
  description: 'Get boo.',
  operationId: 'getBoo',
  tags: ['boo'],
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
      $ref: '#/responses/Error'
    }
  }
};
