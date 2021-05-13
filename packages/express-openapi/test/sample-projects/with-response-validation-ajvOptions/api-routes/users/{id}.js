module.exports = {
  // parameters for all operations in this path
  parameters: [
    {
      name: 'id',
      in: 'path',
      type: 'string',
      required: true,
      description: "Fred's age.",
    },
  ],
  // or they may also be an array of middleware + the method handler.  This allows
  // for flexible middleware management.  express-openapi middleware generated from
  // the <path>.parameters + <methodHandler>.apiDoc.parameters is prepended to this
  // array.
  post: [
    function (req, res, next) {
      next();
    },
    function (req, res) {
      res.validateResponse(200, req.body);
      res.status(200).json(req.body);
    },
  ],
};

module.exports.post.apiDoc = {
  description: 'Create a user.',
  operationId: 'createUser',
  tags: ['users'],
  parameters: [
    {
      name: 'user',
      in: 'body',
      schema: {
        $ref: '#/definitions/User',
      },
    },
  ],

  responses: {
    200: {
      description: 'Requested user',
      schema: {
        $ref: '#/definitions/UserRes',
      },
    },
    default: {
      description: 'Unexpected error',
      schema: {
        $ref: '#/definitions/Error',
      },
    },
  },
};
