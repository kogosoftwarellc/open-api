module.exports = {
  get: get
};

function get(req, res) {
  res.status(200).json({
    id: req.params.id,
    org: req.params.org
  });
}

get.apiDoc = {
  description: 'Retrieve a user.',
  operationId: 'getUser',
  tags: ['users'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      type: 'string',
      required: true,
      description: 'user\'s id'
    },
    {
      name: 'org',
      in: 'path',
      type: 'string',
      required: true,
      description: 'user\'s organization.',
      default: 80
    }
  ],

  responses: {
    200: {
      $ref: '#/definitions/User'
    },
    default: {
      $ref: '#/definitions/Error'
    }
  }
};
