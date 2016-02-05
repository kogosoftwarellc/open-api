module.exports = {
  'x-express-openapi-additional-middleware': [function(req, res, next) {
    req.pathModuleAdded = true;
    next();
  }],

  // parameters for all operations in this path
  parameters: [
    {
      name: 'id',
      in: 'path',
      type: 'string',
      required: true,
      description: 'Fred\'s age.'
    }
  ],
  get: get
};

function get(req, res) {
  res.status(200).json({
    apiDocAdded: req.apiDocAdded,
    pathDocAdded: req.pathDocAdded,
    pathModuleAdded: req.pathModuleAdded
  });
}

get.apiDoc = {
  description: 'Retrieve a user.',
  operationId: 'getUser',
  tags: ['users'],
  parameters: [
    {
      name: 'name',
      in: 'query',
      type: 'string',
      pattern: '^fred$',
      description: 'The name of this person.  It may only be "fred".'
    },
    // showing that operation parameters override path parameters
    {
      name: 'id',
      in: 'path',
      type: 'integer',
      required: true,
      description: 'Fred\'s age.'
    },
    {
      name: 'age',
      in: 'query',
      type: 'integer',
      description: 'Fred\'s age.',
      default: 80
    }
  ],

  responses: {
    default: {
      description: 'showing that additional middleware should have been added at all levels.',
      schema: {
        properties: {
          apiDocAdded: {
            type: 'boolean'
          },
          pathDocAdded: {
            type: 'boolean'
          },
          pathModuleAdded: {
            type: 'boolean'
          }
        }
      }
    }
  }
};
