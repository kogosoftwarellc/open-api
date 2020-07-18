module.exports = {
  get: function (req, res, next) {
    res.status(200).json('success');
  },
};

module.exports.get.apiDoc = {
  description: 'Get foo.',
  operationId: 'getFoo',
  tags: ['foo'],
  responses: {
    default: {
      description: 'Success',
      schema: {
        type: 'string',
      },
    },
  },
};
