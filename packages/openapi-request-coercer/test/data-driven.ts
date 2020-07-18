const expect = require('chai').expect;
const glob = require('glob');
const path = require('path');
const baseDir = path.resolve(__dirname, 'data-driven');
import { Logger } from 'ts-log';
import Sut from '../';

interface LogEntry {
  type: string;
  message: any | undefined;
  optionalParams: any[];
}

class FakeLogger implements Logger {
  public readonly logEntries: LogEntry[] = [];

  public trace(message?: any, ...optionalParams: any[]): void {
    this.logEntries.push(this.build('TRACE', message, optionalParams));
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    this.logEntries.push(this.build('DEBUG', message, optionalParams));
  }

  public info(message?: any, ...optionalParams: any[]): void {
    this.logEntries.push(this.build('INFO', message, optionalParams));
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    this.logEntries.push(this.build('WARN', message, optionalParams));
  }

  public error(message?: any, ...optionalParams: any[]): void {
    this.logEntries.push(this.build('ERROR', message, optionalParams));
  }

  private build(type: string, message: any | undefined, optionalParams: any[]) {
    return { type, message, optionalParams };
  }
}

describe(require('../package.json').name, () => {
  glob.sync('*.js', { cwd: baseDir }).forEach((fixture) => {
    const testName = path.basename(fixture, '.js').replace(/-/g, ' ');
    fixture = require(path.resolve(baseDir, fixture));

    it(`should ${testName}`, () => {
      const fakeLogger = new FakeLogger();
      if (fixture.args) {
        fixture.args.logger = fakeLogger;
      }

      if (fixture.constructorError) {
        expect(() => {
          /* tslint:disable-next-line:no-unused-expression */
          new Sut(fixture.args);
        }).to.throw(fixture.constructorError);
        return;
      }

      const instance = new Sut(fixture.args);
      const request = fixture.request;
      instance.coerce(request);

      if (fixture.headers) {
        expect(request.headers).to.eql(fixture.headers);
      }

      if (fixture.params) {
        expect(request.params).to.eql(fixture.params);
      }

      if (fixture.query) {
        expect(request.query).to.eql(fixture.query);
      }

      if (fixture.body) {
        expect(request.body).to.eql(fixture.body);
      }

      if (fixture.logs) {
        expect(fakeLogger.logEntries).to.eql(fixture.logs);
      } else {
        expect(fakeLogger.logEntries).to.eql([]);
      }
    });
  });
});
