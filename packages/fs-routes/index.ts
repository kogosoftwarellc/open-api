const glob = require('glob');
const path = require('path');
import { dummyLogger, Logger } from 'ts-log';
const memo = {};

function compare(a: string, b: string) {
  let result;
  let ar;
  let br;
  ar = {
    dirname: path.dirname(a).replace(/^\./g, ''),
    basename: path.basename(a).replace(/\:/g, '~')
  };
  br = {
    dirname: path.dirname(b).replace(/^\./g, ''),
    basename: path.basename(b).replace(/\:/g, '~')
  };

  if (ar.dirname === br.dirname) {
    result = -1;
    if (ar.basename > br.basename) {
      result = 1;
    }
  } else {
    result = 1;
    if (ar.dirname < br.dirname) {
      result = -1;
    }
  }

  return result;
}

export interface FsRoutesOptions {
  glob?: string;
  indexFileRegExp?: RegExp;
}

export interface FsRoute {
  path: string;
  route: string;
}

export default function fsRoutes(
  dir: string,
  options: FsRoutesOptions = {},
  logger: Logger = dummyLogger
): FsRoute[] {
  dir = path.resolve(process.cwd(), dir);
  logger.debug('fs-routes::reading from', dir);
  options.glob = options.glob || '**/*.js';
  options.indexFileRegExp = options.indexFileRegExp || /(?:index)?\.js$/;
  const cacheKey = dir + options.glob;

  if (!memo[cacheKey]) {
    memo[cacheKey] = glob
      .sync(options.glob, { cwd: dir })
      .sort(compare)
      .map(file => ({
        path: path.resolve(dir, file),
        route: '/' + file.replace(options.indexFileRegExp, '')
      }));
    logger.debug(`fs-routes::${cacheKey}:`, memo[cacheKey]);
  }

  return memo[cacheKey];
}
