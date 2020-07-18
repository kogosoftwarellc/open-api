// args.apiDoc needs to be a js object.  This file could be a json file, but we can't add
// comments in json files.
module.exports = {
  swagger: '2.0',

  host: 'test-host',
  // all routes will now have /v3 prefixed.
  basePath: '/v3',

  info: {
    title: 'express-openapi sample project',
    version: '3.0.0',
  },

  definitions: {
    Error: {
      additionalProperties: true,
    },
    User: {
      properties: {
        name: {
          type: 'string',
        },
        friends: {
          type: 'array',
          items: {
            $ref: '#/definitions/User',
          },
        },
      },
      required: ['name'],
    },
  },

  // paths are derived from args.routes.  These are filled in by fs-routes.
  paths: {},

  // tags is optional, and is generated / sorted by the tags defined in your path
  // docs.  This API also defines 2 tags in operations: "creating" and "fooey".
  tags: [
    // {name: 'creating'} will be inserted by ./api-routes/users.js
    // {name: 'fooey'} will be inserted by ./api-routes/users/{id}.js
    { description: 'Everything users', name: 'users' },
  ],
};
