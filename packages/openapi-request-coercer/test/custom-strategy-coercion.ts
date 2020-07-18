import { expect } from 'chai';
import Sut, { CoercionStrategy } from '../';

describe('custom coercion strategy', () => {
  describe('when defined', () => {
    for (const strictStrategy of [true, false]) {
      for (const where of [
        ['query', 'query'],
        ['path', 'params'],
        ['header', 'headers'],
      ]) {
        it(`should override ${
          strictStrategy ? 'strict' : 'default'
        } coercion strategy for ${where[0]}`, () => {
          const parameters = [
            {
              in: where[0],
              name: 'number1',
              type: 'number',
              'x-openapi-coercion-strict': strictStrategy,
            },

            {
              in: where[0],
              name: 'integer1',
              type: 'integer',
              'x-openapi-coercion-strict': strictStrategy,
            },

            {
              in: where[0],
              name: 'boolean1',
              type: 'boolean',
              'x-openapi-coercion-strict': strictStrategy,
            },
          ];

          const request = {};
          request[where[1]] = {
            number1: '05.32',
            integer1: '07.00',
            boolean1: 'FalSe',
          };

          const seen: string[] = [];

          const dummyStrategy = (type: string, input: any) => {
            const output = `${type}(${input})`;
            seen.push(output);
            return output;
          };

          const coercionStrategy: CoercionStrategy = {
            boolean: (input) => dummyStrategy('boolean', input),
            number: (input) => dummyStrategy('number', input),
            integer: (input) => dummyStrategy('integer', input),
          };

          const sut = new Sut({ parameters, coercionStrategy });
          sut.coerce(request);

          expect(request[where[1]].number1).to.eql('number(05.32)');
          expect(request[where[1]].integer1).to.eql('integer(07.00)');
          expect(request[where[1]].boolean1).to.eql('boolean(FalSe)');

          expect(seen).to.have.lengthOf(3);
          expect(seen).to.include('number(05.32)');
          expect(seen).to.include('integer(07.00)');
          expect(seen).to.include('boolean(FalSe)');
        });
      }
    }
  });
});
