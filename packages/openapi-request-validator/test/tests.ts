const expect = require('chai').expect;
import Sut from '../';

describe(require('../package.json').name, () => {
  it('should not modify the input parameters', () => {
    const initialArguments = createArguments();
    /* tslint:disable:no-unused-expression */
    // @ts-ignore
    new Sut(initialArguments);
    expect(initialArguments).to.eql(createArguments());
  });
  it('should accept a logger', () => {
    /* tslint:disable:no-unused-expression */
    // @ts-ignore
    new Sut({ logger: console, schemas: [{}] });
  });

  function createArguments() {
    return {
      parameters: [
        {
          in: 'body',
          name: 'User',
          schema: {
            $ref: '#/definitions/User',
          },
        },
      ],

      schemas: {
        User: {
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    };
  }
});
