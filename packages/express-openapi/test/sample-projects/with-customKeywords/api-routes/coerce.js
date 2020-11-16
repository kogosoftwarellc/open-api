module.exports = {
  get: function (req, res) {
    res.status(200).json({
      isoDateString: req.query.milliseconds.toISOString(),
      ignoredString: req.query.ignore,
    });
  },
};

module.exports.get.apiDoc = {
  description: 'Coerce milliseconds since unix-epoch to javascript Date',
  operationId: 'coerce',
  parameters: [
    {
      name: 'milliseconds',
      in: 'query',
      type: 'string',
      'x-coerce': 'Date',
    },
    {
      name: 'ignore',
      in: 'query',
      type: 'string',
      'x-coerce': 'Ignore',
    },
  ],
  responses: {
    200: {
      description: 'Testing custom keywords',
    },
  },
};
