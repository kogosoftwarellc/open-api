module.exports = {
  get: get,
};

function get(ctx) {
  if (ctx.query.type === 'apiDoc') {
    return (ctx.body = ctx.state.apiDoc);
  }
  return (ctx.body = ctx.state.operationDoc);
}

get.apiDoc = {
  operationId: 'getApiDoc',
  description: 'Returns the requested apiDoc',
  parameters: [
    {
      description: 'The type of apiDoc to return.',
      in: 'query',
      name: 'type',
      type: 'string',
      enum: ['apiDoc', 'operationDoc'],
    },
  ],
  responses: {
    200: {
      description: 'The requested apiDoc.',
      schema: {
        type: 'object',
      },
    },
    default: {
      description: 'The requested apiDoc.',
    },
  },
};
