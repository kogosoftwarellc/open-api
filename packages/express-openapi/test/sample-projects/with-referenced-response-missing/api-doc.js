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

  definitions: {},

  parameters: {
    Boo: {
      in: 'query',
      type: 'string',
      name: 'boo',
      required: true
    },
    Foo: {
      in: 'query',
      type: 'string',
      name: 'foo',
      required: true,
      enum: [
        'success',
        'error'
      ]
    }
  },

  // paths are derived from args.routes.  These are filled in by fs-routes.
  paths: {}
};
