// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  post: post
};

function post(req, res, next) {
  res.send(typeof req.body);
}

module.exports.post.apiDoc = {
  consumes: ['application/json'],
  description: 'Consumes operation',
  operationId: 'showConsumes',
  parameters: [],
  responses: {
    200: {
      description: 'Consumes output',
      schema: {
        type: 'string'
      }
    }
  }
};
