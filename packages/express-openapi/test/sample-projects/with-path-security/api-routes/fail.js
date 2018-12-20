module.exports = {
  get: function(req, res, next) {
    res.status(200).send('fail');
  }
};

module.exports.get.apiDoc = {
  description: 'Get fail.',
  operationId: 'getFail',
  parameters: [],
  responses: {
    204: { description: 'testing security' }
  }
};
