const supertest = require('supertest');
const express = require('express');
const openapi = require('../../../');
const path = require('path');

describe('using servers attribute', function() {
  const tests = [
    {
      name: 'with relative url with variable and enum',
      servers: [
        {
          url: '/{base}',
          variables: {
            base: {
              default: 'v1',
              enum: ['v1', 'api']
            }
          }
        }
      ],
      expectedPaths: [
        '/v1/users',
        '/api/users',
        '/v1/api-docs',
        '/api/api-docs'
      ]
    },
    {
      name: 'with  multiple full urls',
      servers: [
        {
          url: 'https://my.api.io/v1'
        },
        {
          url: 'https://my.proxy.io/api/v1'
        }
      ],
      expectedPaths: [
        '/v1/users',
        '/api/v1/users',
        '/v1/api-docs',
        '/api/v1/api-docs'
      ]
    },
    {
      name: 'with multiple full urls with the same path',
      servers: [
        { url: 'http://my.api.io/v1' },
        { url: 'https://my.api.io/v1' }
      ],
      expectedPaths: ['/v1/users']
    },
    {
      name: 'with multiple servers both relative and full',
      servers: [
        {
          url: '/v1'
        },
        {
          url: 'https://my.server.io/api'
        }
      ],
      expectedPaths: [
        '/v1/users',
        '/api/users',
        '/v1/api-docs',
        '/api/api-docs'
      ]
    },
    {
      name: 'with  multiple servers that have relative paths',
      servers: [{ url: '/v1' }, { url: '/api' }],
      expectedPaths: [
        '/v1/users',
        '/api/users',
        '/v1/api-docs',
        '/api/api-docs'
      ]
    },
    {
      name: 'with relative url that has variables',
      servers: [{ url: '/{base}', variables: { base: { default: 'api' } } }],
      expectedPaths: [
        '/api/users',
        '/foo/users',
        '/me/users',
        '/api/api-docs',
        '/wiki/api-docs'
      ]
    },
    {
      name: 'with single full url',
      servers: [{ url: 'http://my.api.io/v1' }],
      expectedPaths: ['/v1/users', '/v1/api-docs']
    },
    {
      name: 'with single relative url',
      servers: [{ url: '/v1' }],
      expectedPaths: ['/v1/users', '/v1/api-docs']
    },
    {
      name: 'with variable in host part of the url',
      servers: [
        { url: 'http://{host}/v1', variables: { host: { default: 'foo.com' } } }
      ],
      expectedPaths: ['/v1/users', '/v1/api-docs']
    }
  ];

  for (let test of tests) {
    describe(test.name, function() {
      let request;
      before(function() {
        const app = express();
        openapi.initialize({
          app,
          apiDoc: generateOpenApiDocWithServers(test.servers),
          paths: path.resolve(__dirname, 'api-routes')
        });
        request = supertest(app);
      });
      for (let i of test.expectedPaths) {
        it(`should have route ${i}`, function(done) {
          request
            .get(i)
            .expect(200)
            .end(function(error) {
              done(error);
            });
        });
      }
    });
  }
});

function generateOpenApiDocWithServers(servers) {
  return {
    openapi: '3.0.0',
    info: {
      title: 'test',
      version: '1.0'
    },
    paths: {},
    servers
  };
}
