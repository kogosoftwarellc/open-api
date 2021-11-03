// args.apiDoc needs to be a js object.  This file could be a json file, but we can't add
// comments in json files.
module.exports = {
  swagger: '2.0',

  // all routes will now have /v3 prefixed.
  basePath: '/v3',

  info: {
    title: 'koa-openapi sample project',
    version: '3.0.0',
  },

  definitions: {},

  // paths are derived from args.routes.  These are filled in by fs-routes.
  paths: {},

  // set boo for api wide security.  We'll override this for the foo route.
  security: [
    {
      booAuth: [],
      boo2Auth: [],
    },
  ],

  securityDefinitions: {
    booAuth: {
      type: 'basic',
    },
    boo2Auth: {
      type: 'basic',
    },
    failAuth: {
      type: 'basic',
    },
    fooAuth: {
      type: 'basic',
    },
  },
};
