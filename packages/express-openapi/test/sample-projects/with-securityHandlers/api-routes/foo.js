module.exports = {
  get: function (req, res, next) {
    res.status(200).send(req.foo);
  },
};

module.exports.get.apiDoc = {
  description: 'Get foo.',
  operationId: 'getFoo',
  parameters: [],
  security: [
    {
      fooAuth: [],
    },
  ],
  responses: {
    204: { description: 'testing security' },
  },
};
