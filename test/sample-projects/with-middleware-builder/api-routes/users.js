// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  get: [function(req, res, next) {
    res.status(200).json({baz: req.query.baz});
  }],

  post: function(req, res, next) {
    res.status(200).json({message: 'foo'});
  },

  patch: function(req, res, next) {
    res.status(200).json({message: req.query.baz});
  }
};


module.exports.get.apiDoc = {
  parameters: [
    {
      in: "query",
      name: "baz",
      type: "string",
      required: true
    }
  ],
  responses: {
    default: {
      description: "a response"
    }
  }
};

module.exports.post.apiDoc = {
  security: [{
    'api-key': []
  }],
  responses: {
    default: {
      description: "a response"
    }
  }
};

module.exports.patch.apiDoc = {
  security: [{
    'api-key': []
  }],
  responses: {
    default: {
      description: "a response"
    }
  }
};

module.exports.patch.disableGlobalMiddlewareBuilder = true;
module.exports.patch.middlewareBuilder = function(middleware, methodDoc, apiDoc) {
  middleware.unshift(function(req, res, next) {
    req.query.baz = 'zoo';
    next();
  });
};
