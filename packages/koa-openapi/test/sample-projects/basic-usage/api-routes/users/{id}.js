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
  // method handlers may just be the method handler...
  get: get,
  // or they may also be an array of middleware + the method handler.  This allows
  // for flexible middleware management.  express-openapi middleware generated from
  // the <path>.parameters + <methodHandler>.apiDoc.parameters is prepended to this
  // array.
  post: [
    function (ctx, next) {
      return;
    },
    post,
  ],
};

function post(ctx) {
  ctx.status = 200;
  ctx.body = { id: ctx.params.id };
}

// verify that apiDoc is available with middleware
post.apiDoc = {
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
    default: {
      description: 'Unexpected error',
      schema: {
        $ref: '#/definitions/Error',
      },
    },
  },
};

function get(ctx) {
  ctx.status = 200;
  ctx.body = {
    id: ctx.params.id,
    name: ctx.query.name,
    age: ctx.query.age,
  };
}

get.apiDoc = {
  description: 'Retrieve a user.',
  operationId: 'getUser',
  tags: ['users', 'fooey'],
  parameters: [
    {
      name: 'name',
      in: 'query',
      type: 'string',
      pattern: '^fred$',
      description: 'The name of this person.  It may only be "fred".',
    },
    // showing that operation parameters override path parameters
    {
      name: 'id',
      in: 'path',
      type: 'integer',
      required: true,
      description: "Fred's age.",
    },
    {
      name: 'age',
      in: 'query',
      type: 'integer',
      description: "Fred's age.",
      default: 80,
    },
  ],

  responses: {
    200: {
      description: 'Requested user',
      schema: {
        $ref: '#/definitions/User',
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
