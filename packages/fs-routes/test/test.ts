import fsRoutes from '../';
const assert = require('assert');
const path = require('path');
const testDir = path.resolve(__dirname, '..', 'test-dir');

function assertRoutes(routes) {
  const output = [
    {
      path: testDir + '/home.cjs',
      route: '/home',
    },
    {
      path: testDir + '/home.js',
      route: '/home',
    },
    {
      path: testDir + '/users/index.cjs',
      route: '/users/',
    },
    {
      path: testDir + '/users/index.js',
      route: '/users/',
    },
    {
      path: testDir + '/users/query.cjs',
      route: '/users/query',
    },
    {
      path: testDir + '/users/query.js',
      route: '/users/query',
    },
    {
      path: testDir + '/users/{id}.cjs',
      route: '/users/{id}',
    },
    {
      path: testDir + '/users/{id}.js',
      route: '/users/{id}',
    },
    {
      path: testDir + '/users/:id.cjs',
      route: '/users/:id',
    },
    {
      path: testDir + '/users/:id.js',
      route: '/users/:id',
    },
  ];

  assert.deepEqual(routes, output);
}

describe('fs-routes', () => {
  describe('when run against a directory for the first time', () => {
    it('should work', () => {
      assertRoutes(fsRoutes('test-dir'));
    });
  });

  describe('when run against a directory twice', () => {
    it('should workd', () => {
      assertRoutes(fsRoutes('test-dir')); // caching
      assertRoutes(fsRoutes('test-dir')); // caching
    });
  });

  describe('when run with a file match pattern', () => {
    it('should work', () => {
      assert.deepEqual(
        fsRoutes('test-dir', {
          glob: '**/*.ts',
          indexFileRegExp: /(?:query)?\.ts$/,
        }),
        [
          {
            path: testDir + '/hom.a.ts',
            route: '/hom.a',
          },
          {
            path: testDir + '/home.ts',
            route: '/home',
          },
          {
            path: testDir + '/users/query.ts',
            route: '/users/',
          },
        ]
      );
    });
  });
});
