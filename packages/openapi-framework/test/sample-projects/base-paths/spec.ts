import { assert } from 'chai';
import * as path from 'path';
import OpenapiFramework from '../../../';

describe('using servers attribute', () => {
  describe('with no defined servers', () => {
    let framework: OpenapiFramework;

    before(() => {
      framework = new OpenapiFramework(generateOpenApiDocArgsWithServers());
    });
    it('should have a single baseUrl with a path of empty string', async () => {
      const testFn = (ctx) => {
        assert.equal(ctx.basePaths.length, 1);
        assert.equal(ctx.basePaths[0].path, '');
        assert.isFalse(ctx.basePaths[0].hasVariables());
      };
      await framework.initialize({
        visitApi: testFn,
        visitOperation: testFn,
        visitPath: testFn,
      });
    });
  });

  describe('with variable and enum', () => {
    const servers = [
      {
        url: '/{base}',
        variables: {
          base: {
            default: 'v1',
            enum: ['v1', 'api'],
          },
        },
      },
    ];

    let framework: OpenapiFramework;

    before(() => {
      framework = new OpenapiFramework(
        generateOpenApiDocArgsWithServers(servers)
      );
    });

    it('should have have enum attribute to the basePath', async () => {
      const testFn = (ctx) => {
        assert.equal(ctx.basePaths.length, 1);
        assert.equal(ctx.basePaths[0].path, '/:base');
        assert.isTrue(ctx.basePaths[0].hasVariables());
        assert.deepEqual(ctx.basePaths[0].variables.base.enum, ['v1', 'api']);
      };
      await framework.initialize({
        visitApi: testFn,
        visitOperation: testFn,
        visitPath: testFn,
      });
    });
  });
  describe('with multiple urls', () => {
    const servers = [
      {
        url: 'http://my.api.io/v1',
      },
      {
        url: '/api/v1',
      },
      { url: 'https://my.api.io/api/v1' },
    ];
    let framework: OpenapiFramework;
    before(() => {
      framework = new OpenapiFramework(
        generateOpenApiDocArgsWithServers(servers)
      );
    });
    it('should have each unique base path present', async () => {
      const testFn = (ctx) => {
        assert.equal(ctx.basePaths.length, 2);
        assert.deepEqual(
          ctx.basePaths.map((basePath) => basePath.path),
          ['/v1', '/api/v1']
        );
      };
      await framework.initialize({
        visitApi: testFn,
        visitOperation: testFn,
        visitPath: testFn,
      });
    });
  });
});

function generateOpenApiDocArgsWithServers(servers?) {
  return {
    apiDoc: {
      openapi: '3.0.0',
      info: {
        title: 'test',
        version: '1.0',
      },
      paths: {},
      servers,
    },
    featureType: 'middleware',
    name: 'some-framework',
    paths: path.resolve(__dirname, 'paths'),
  };
}
