module.exports = {
  get: function (req, res, next) {
    res.status(200).send(req.foo);
  },
};

module.exports.get.apiDoc = {
  description: 'Get fail.',
  operationId: 'getFail',
  parameters: [
    {
      name: 'name',
      in: 'query',
      type: 'string',
      required: true,
      description: 'just a mandatory field',
    },
  ],
  security: [
    {
      failAuth: [],
    },
  ],
  responses: {
    204: { description: 'testing security' },
  },
};
