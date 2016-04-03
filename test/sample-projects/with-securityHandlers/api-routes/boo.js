module.exports = {
  get: function(req, res, next) {
    res.status(200).send(req.boo + req.boo2);
  }
};

module.exports.get.apiDoc = {
  description: 'Get boo.',
  operationId: 'getBoo',
  parameters: [],
  responses: {
    204: {description: 'testing security'}
  }
};
