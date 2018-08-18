var assert = require('assert');
var fsRoutes = require('./');

assertRoutes(fsRoutes('test-dir'));
assertRoutes(fsRoutes('test-dir'));// caching
assert.deepEqual(fsRoutes('test-dir', {glob: '**/*.ts', indexFileRegExp: /(?:query)?\.ts$/}), [
  {
    path: __dirname + '/test-dir/hom.a.ts',
    route: '/hom.a'
  },
  {
    path: __dirname + '/test-dir/home.ts',
    route: '/home'
  },
  {
    path: __dirname + '/test-dir/users/query.ts',
    route: '/users/'
  }
]);

function assertRoutes(routes) {
  var output = [
    {
      path: __dirname + '/test-dir/home.js',
      route: '/home'
    },
    {
      path: __dirname + '/test-dir/users/index.js',
      route: '/users/'
    },
    {
      path: __dirname + '/test-dir/users/query.js',
      route: '/users/query'
    },
    {
      path: __dirname + '/test-dir/users/{id}.js',
      route: '/users/{id}'
    },
    {
      path: __dirname + '/test-dir/users/:id.js',
      route: '/users/:id'
    }
  ];

  assert.deepEqual(routes, output);
}
