module.exports = {
  get: function(req, res, next) {
    res.status(200).send('foo');
  }
};

module.exports.get.apiDoc = {
  description: 'Get foo.',
  operationId: 'getFoo',
  parameters: [],
  responses: {
    204: {description: 'testing security'}
  }
};
