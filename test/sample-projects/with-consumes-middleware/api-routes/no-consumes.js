// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  post: post
};

function post(req, res, next) {
  console.log('body', req.body);
  res.send(typeof req.body);
}

module.exports.post.apiDoc = {
  description: 'No consumes operation',
  operationId: 'showNoConsumes',
  parameters: [],
  responses: {
    200: {
      description: 'No consumes output',
      schema: {
        type: 'string'
      }
    }
  }
};
