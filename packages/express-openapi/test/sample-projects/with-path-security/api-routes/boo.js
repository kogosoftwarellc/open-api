module.exports = {
  get: function (req, res, next) {
    res.status(200).send('boo');
  },
};

module.exports.get.apiDoc = {
  description: 'Get boo.',
  operationId: 'getBoo',
  parameters: [],
  responses: {
    204: { description: 'testing security' },
  },
};
