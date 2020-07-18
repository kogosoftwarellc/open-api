module.exports = {
  get: function (req, res, next) {
    var statusCode;
    switch (req.query.status) {
      case 'success':
        statusCode = 200;
        break;
      case 'method-not-allowed':
        statusCode = 405;
        break;
      case 'forbidden':
        statusCode = 403;
        break;
      case 'tea-pod':
        statusCode = 418;
        break;
      default:
        statusCode = 500;
    }

    var errors = res.validateResponse(
      statusCode,
      statusCode === 200 ? [{}] : {}
    );
    if (errors) {
      throw errors;
    }
  },
  // handling no method doc
  post: function () {
    return;
  },
};

module.exports.get.apiDoc = {
  description: 'List user',
  operationId: 'listUser',
  parameters: [
    {
      in: 'query',
      name: 'status',
      type: 'string',
      enum: ['success', 'method-not-allowed', 'forbidden', 'tea-pod', 'error'],
    },
  ],
  responses: {
    // following 3 status are references external schema through local ref.
    200: {
      // in child schema
      description: 'List of users',
      schema: {
        type: 'array',
        items: { $ref: '#/definitions/User' },
      },
    },
    405: {
      // self schema
      description: 'Method not allowed',
      schema: { $ref: '#/definitions/Error' },
    },
    403: {
      // through response definition
      $ref: '#/responses/Forbidden',
    },
    // following 2 status are references external schema directly.
    418: {
      // in child schema
      description: 'I am a tea pod',
      schema: {
        type: 'object',
        allOf: [{ $ref: 'http://example.com/tea-pod' }],
      },
    },
    default: {
      // self schema
      description: 'Error',
      schema: { $ref: 'http://example.com/error#/schema' },
    },
  },
};

module.exports.post.apiDoc = {
  description: 'Create new user',
  operationId: 'createUser',
  parameters: [
    {
      in: 'body',
      name: 'user',
      schema: { $ref: 'http://example.com/user' },
    },
  ],
  responses: {
    default: {
      $ref: '#/responses/Error',
    },
  },
};
