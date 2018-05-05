// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  post: post
};

function post(req, res, next) {
  res.send(typeof req.body);
}

module.exports.post.apiDoc = {
  consumes: [],
  description: 'No matching consumes operation',
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
