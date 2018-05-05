// args.apiDoc needs to be a js object.  This file could be a json file, but we can't add
// comments in json files.
module.exports = {
  swagger: '2.0',

  // all routes will now have /v3 prefixed.
  basePath: '/v3',

  info: {
    title: 'express-openapi sample project',
    version: '3.0.0'
  },

  definitions: {
    Error: {
      additionalProperties: true
    },
    User: {
      properties: {
        id: {
          type: 'string'
        },
        org: {
          type: 'string'
        }
      },
      required: ['name']
    },
    Vm: {
      properties: {
        id: {
          type: 'string'
        },
        region: {
          type: 'string'
        },
        az: {
          type: 'string'
        }
      }
    }
  },

  // paths are derived from args.routes.  These are filled in by fs-routes.
  paths: {},

  // tags is optional, and is generated / sorted by the tags defined in your path
  // docs.  This API also defines 2 tags in operations: "creating" and "fooey".
  tags: [
    {description: 'Everything users', name: 'users'},
    {description: 'Everything virtual machines', name: 'vm'}
  ]
};
