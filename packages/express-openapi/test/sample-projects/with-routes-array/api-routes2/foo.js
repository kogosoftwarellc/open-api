module.exports = {
  get: function (req, res, next) {
    res.status(200).send('foo');
  },
};

module.exports.get.apiDoc = {
  description: 'Get foo.',
  operationId: 'getFoo',
  parameters: [],
  responses: {
    200: {
      description: 'foo',
      schema: {
        type: 'string',
      },
    },
  },
};
