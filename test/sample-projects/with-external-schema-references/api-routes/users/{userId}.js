module.exports = {
  parameters: [
    {
      $ref: '#/parameters/User'
    },
    {
      $ref: '#/parameters/userId'
    }
  ],
  put: function(req, res, next) {},
  delete: function(req, res, next) {
    res.status(500).end('error');
  }
};

module.exports.put.apiDoc = {
  description: 'Update a user.',
  operationId: 'updateUser',
  responses: {
    default: {
      $ref: '#/responses/Error'
    }
  }
};

module.exports.delete.apiDoc = {
  description: 'Delete a user',
  operationId: 'deleteUser',
  parameters: [
    {
      in: "body",
      name: "user",
      schema: { $ref: "#/definitions/User"}
    }
  ],
  responses: {
    default: {
      $ref: '#/responses/Error'
    }
  }
};
