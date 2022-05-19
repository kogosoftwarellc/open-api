/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import OpenAPIDefaultSetter from 'openapi-default-setter';
import OpenAPIRequestCoercer from 'openapi-request-coercer';
import OpenAPIRequestValidator from 'openapi-request-validator';
import OpenAPIResponseValidator from 'openapi-response-validator';
import OpenAPISecurityHandler from 'openapi-security-handler';
import OpenapiFramework from '../../../';
const path = require('path');

describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;

  beforeEach(() => {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      featureType: 'middleware',
      name: 'some-framework',
      paths: path.resolve(__dirname, './paths'),
      pathSecurity: [
        [/.+/, [{ basic: [] }]],
        [/^awes/, [{ basic: [] }]],
      ],
      securityHandlers: {
        basic() {
          return true;
        },
      },
    });
  });

  it('should instantiate default features', async () => {
    await framework.initialize({
      visitOperation(ctx) {
        expect(ctx.features.coercer).to.be.instanceof(OpenAPIRequestCoercer);
        expect(ctx.features.defaultSetter).to.be.instanceof(
          OpenAPIDefaultSetter
        );
        expect(ctx.features.requestValidator).to.be.instanceof(
          OpenAPIRequestValidator
        );
        expect(ctx.features.responseValidator).to.be.instanceof(
          OpenAPIResponseValidator
        );
        expect(ctx.features.securityHandler).to.be.instanceof(
          OpenAPISecurityHandler
        );
      },
      visitApi(ctx) {
        const apiDoc = ctx.getApiDoc();
        expect(apiDoc.paths['/foo']).to.eql({
          parameters: [],
          get: {
            parameters: [
              {
                name: 'name',
                in: 'query',
                type: 'string',
                default: 'elvis',
              },
            ],
            responses: {
              default: {
                description: 'return foo',
                schema: {},
              },
            },
            security: [
              {
                basic: [],
              },
            ],
          },
        });
      },
    });
  });
});
