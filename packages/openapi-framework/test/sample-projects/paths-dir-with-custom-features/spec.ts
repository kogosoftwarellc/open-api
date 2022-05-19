/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import OpenapiFramework from '../../../';
import CustomDefaultSetter from './features/CustomDefaultSetter';
import CustomCoercer from './features/CustomCoercer';
import CustomRequestValidator from './features/CustomRequestValidator';
import CustomResponseValidator from './features/CustomResponseValidator';
import CustomSecurityHandler from './features/CustomSecurityHandler';
const path = require('path');

describe(path.basename(__dirname), () => {
  let framework: OpenapiFramework;

  beforeEach(() => {
    framework = new OpenapiFramework({
      apiDoc: path.resolve(__dirname, 'apiDoc.yml'),
      featureType: 'middleware',
      features: {
        coercer: CustomCoercer,
        defaultSetter: CustomDefaultSetter,
        requestValidator: CustomRequestValidator,
        responseValidator: CustomResponseValidator,
        securityHandler: CustomSecurityHandler,
      },
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

  it('should instantiate custom features', async () => {
    await framework.initialize({
      visitOperation(ctx) {
        expect(ctx.features.coercer).to.be.instanceof(CustomCoercer);
        expect(ctx.features.defaultSetter).to.be.instanceof(
          CustomDefaultSetter
        );
        expect(ctx.features.requestValidator).to.be.instanceof(
          CustomRequestValidator
        );
        expect(ctx.features.responseValidator).to.be.instanceof(
          CustomResponseValidator
        );
        expect(ctx.features.securityHandler).to.be.instanceof(
          CustomSecurityHandler
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
