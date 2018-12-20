module.exports = {
  get: function(req, res) {
    res.status(200).json({ name: req.query.foo });
  },

  post: function(req, res) {
    var validationResult = res.validateResponse(200, { name: req.query.foo });
    res.status(validationResult ? 400 : 200).json({
      errors: (validationResult || { errors: [] }).errors
    });
  }
};

module.exports.get.apiDoc = {
  description: 'Get foo.',
  operationId: 'getFoo',
  parameters: [
    {
      format: 'foo',
      in: 'query',
      name: 'foo',
      type: 'string'
    }
  ],
  responses: {
    200: {
      description: 'testing input validation',
      schema: {
        $ref: '#/definitions/Foo'
      }
    }
  }
};

module.exports.post.apiDoc = {
  description: 'Create foo.',
  operationId: 'createFoo',
  parameters: [],
  responses: {
    200: {
      description: 'testing response validation',
      schema: {
        $ref: '#/definitions/Foo'
      }
    }
  }
};
