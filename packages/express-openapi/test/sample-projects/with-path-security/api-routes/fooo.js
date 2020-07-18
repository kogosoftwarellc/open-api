module.exports = {
  get: function (req, res, next) {
    res.status(200).send('fooo');
  },
};

module.exports.get.apiDoc = {
  description: 'Get fooo.',
  operationId: 'getFooo',
  parameters: [],
  responses: {
    204: { description: 'testing security' },
  },
  security: [],
};
