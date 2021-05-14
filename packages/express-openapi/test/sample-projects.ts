const expect = require('chai').expect;
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const request = require('supertest');

describe(require('../package.json').name + ' sample-projects', () => {
  describe('configuring middleware', () => {
    const coercionMissingBody = {
      errors: [
        {
          errorCode: 'type.openapi.requestValidation',
          location: 'path',
          message: 'must be integer',
          path: 'id',
        },
      ],
      status: 400,
    };

    [
      // adding additional middleware
      {
        name: 'with-additional-middleware',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: {
          orderingApiDoc: 'pathModule',
          apiDocAdded: true,
          pathDocAdded: true,
          pathModuleAdded: true,
        },
      },

      // not inheriting additional middleware
      {
        name: 'with-inherit-additional-middleware-false-at-methodDoc',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: {
          apiDocAdded: null,
          pathDocAdded: null,
          pathModuleAdded: null,
        },
      },
      {
        name: 'with-inherit-additional-middleware-false-at-pathDoc',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: {
          apiDocAdded: null,
          pathDocAdded: true,
          pathModuleAdded: true,
        },
      },
      {
        name: 'with-inherit-additional-middleware-false-at-pathModule',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: {
          apiDocAdded: null,
          pathDocAdded: null,
          pathModuleAdded: true,
        },
      },

      // disable coercion
      {
        name: 'with-coercion-middleware-disabled-in-methodDoc',
        url: '/v3/users/34?name=fred',
        expectedStatus: 400,
        expectedBody: coercionMissingBody,
      },
      {
        name: 'with-coercion-middleware-disabled-in-pathItem',
        url: '/v3/users/34?name=fred',
        expectedStatus: 400,
        expectedBody: coercionMissingBody,
      },
      {
        name: 'with-coercion-middleware-disabled-in-pathModule',
        url: '/v3/users/34?name=fred',
        expectedStatus: 400,
        expectedBody: coercionMissingBody,
      },
      {
        name: 'with-coercion-middleware-disabled-in-the-apiDoc',
        url: '/v3/users/34?name=fred',
        expectedStatus: 400,
        expectedBody: coercionMissingBody,
      },

      // disable defaults, must now also disable request validation middleware
      {
        name: 'with-defaults-middleware-disabled-in-methodDoc',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: { id: 34, name: 'fred', age: 80 },
      },
      {
        name: 'with-defaults-middleware-disabled-in-pathItem',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: { id: 34, name: 'fred', age: 80 },
      },
      {
        name: 'with-defaults-middleware-disabled-in-pathModule',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: { id: 34, name: 'fred', age: 80 },
      },
      {
        name: 'with-defaults-middleware-disabled-in-the-apiDoc',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: { id: 34, name: 'fred', age: 80 },
      },

      // disable validation
      {
        name: 'with-validation-middleware-disabled-in-methodDoc',
        url: '/v3/users/asdf?name=fred',
        expectedStatus: 200,
        expectedBody: { age: 80, id: 'asdf', name: 'fred' },
      },
      {
        name: 'with-validation-middleware-disabled-in-pathItem',
        url: '/v3/users/asdf?name=fred',
        expectedStatus: 200,
        expectedBody: { age: 80, id: 'asdf', name: 'fred' },
      },
      {
        name: 'with-validation-middleware-disabled-in-pathModule',
        url: '/v3/users/5?name=fred',
        expectedStatus: 200,
        expectedBody: { age: 80, id: 5, name: 'fred' },
      },
      {
        name: 'with-validation-middleware-disabled-in-the-apiDoc',
        url: '/v3/users/15?name=fred',
        expectedStatus: 200,
        expectedBody: { age: 80, id: 15, name: 'fred' },
      },

      // disable all
      {
        name: 'with-middleware-disabled-in-methodDoc',
        url: '/v3/users/asdf?name=fred',
        expectedStatus: 200,
        expectedBody: { id: 'asdf', name: 'fred' },
      },
      {
        name: 'with-middleware-disabled-in-pathItem',
        url: '/v3/users/asdf?name=fred',
        expectedStatus: 200,
        expectedBody: { id: 'asdf', name: 'fred' },
      },
      {
        name: 'with-middleware-disabled-in-pathModule',
        url: '/v3/users/asdf?name=fred',
        expectedStatus: 200,
        expectedBody: { id: 'asdf', name: 'fred' },
      },
      {
        name: 'with-middleware-disabled-in-the-apiDoc',
        url: '/v3/users/asdf?name=fred',
        expectedStatus: 200,
        expectedBody: { id: 'asdf', name: 'fred' },
      },
    ].forEach((test) => {
      describe(test.name, () => {
        let app;

        before(() => {
          app = require('./sample-projects/' + test.name + '/app.js');
        });

        it('should meet expectations', (done) => {
          request(app)
            .get(test.url)
            .expect(test.expectedStatus)
            .end((err, res) => {
              expect(res.body).to.eql(test.expectedBody);
              done(err);
            });
        });
      });
    });

    [
      // disable response validation
      {
        name: 'with-response-validation-middleware-disabled-in-methodDoc',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: true,
      },
      {
        name: 'with-response-validation-middleware-disabled-in-pathItem',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: true,
      },
      {
        name: 'with-response-validation-middleware-disabled-in-pathModule',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: true,
      },
      {
        name: 'with-response-validation-middleware-disabled-in-the-apiDoc',
        url: '/v3/users/34?name=fred',
        expectedStatus: 200,
        expectedBody: true,
      },
    ].forEach((test) => {
      describe(test.name, () => {
        let app;

        before(() => {
          app = require('./sample-projects/' + test.name + '/app.js');
        });

        it('should not expose res.validateResponse in the app', (done) => {
          request(app)
            .get(test.url)
            .expect(test.expectedStatus)
            .end((err, res) => {
              expect(res.body).to.eql(test.expectedBody);
              done(err);
            });
        });
      });
    });
  });

  glob
    .sync('./sample-projects/*', { cwd: __dirname })
    .forEach((sampleProjectPath) => {
      const specName = path.basename(sampleProjectPath);
      const specPath = path.resolve(__dirname, sampleProjectPath, 'spec.js');

      if (
        [
          // progressively move sample project tests up
          'basic-usage',
        ].indexOf(specName) > -1
      ) {
        return;
      }

      if (fs.existsSync(specPath)) {
        describe(specName, () => {
          require(specPath);
        });
      }
    });
});

require('../../../test/sample-projects.js')(
  require('../package.json').name,
  __dirname
);
