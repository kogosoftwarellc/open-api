var assert = require('assert');
var fsRoutes = require('./');

assertRoutes(fsRoutes('test-dir'));
assertRoutes(fsRoutes('test-dir'));// caching

function assertRoutes(routes) {
  var output = [
    {
      path: __dirname + '/test-dir/home.js',
      route: '/home'
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
