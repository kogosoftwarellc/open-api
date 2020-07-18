module.exports = {
  GET: GET,
};

function GET(req, res, next) {
  res.status(200).send(req.query.testParam + req.query.testParam1);
}

GET.apiDoc = {
  description: 'Tests case insensitive query params.',
  operationId: 'getTestParam',
  parameters: [
    {
      'x-express-openapi-case-sensitive': false,
      in: 'query',
      name: 'testParam',
      required: true,
      type: 'string',
    },
    {
      in: 'query',
      name: 'testParam1',
      required: true,
      type: 'string',
    },
  ],
  responses: {
    200: {
      description: 'The test param value.',
      schema: {
        type: 'string',
      },
    },
  },
};
