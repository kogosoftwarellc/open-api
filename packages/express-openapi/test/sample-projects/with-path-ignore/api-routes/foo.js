module.exports = {
  get: function (req, res) {
    res.status(200).send('OK');
  },
};

module.exports.get.apiDoc = {
  description: '',
  operationId: '',
  responses: {
    200: {
      description: '',
    },
  },
};
