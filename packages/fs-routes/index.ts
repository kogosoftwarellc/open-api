const glob = require('glob');
const path = require('path');
const memo = {};

function compare(a: string, b: string) {
  let result, ar, br;
  ar = {
    dirname: path.dirname(a).replace(/^\./g, ''),
    basename: path.basename(a).replace(/\:/g, '~')
  };
  br = {
    dirname: path.dirname(b).replace(/^\./g, ''),
    basename: path.basename(b).replace(/\:/g, '~')
  };

  if(ar.dirname === br.dirname) {
    result = -1;
    if(ar.basename > br.basename) {
      result = 1;
    }
  } else {
    result = 1;
    if(ar.dirname < br.dirname) {
      result = -1;
    }
  }

  return result
}

interface FsRoutesOptions {
  glob?: string
  indexFileRegExp?: RegExp
}

interface FsRoute {
  path: string
  route: string
}

interface FsRoutes {
  [index: number]: FsRoute
}

function fsRoutes(dir: string, options: FsRoutesOptions = {}): FsRoutes {
  dir = path.resolve(process.cwd(), dir);
  options.glob = options.glob || '**/*.js';
  options.indexFileRegExp = options.indexFileRegExp || /(?:index)?\.js$/;
  const cacheKey = dir + options.glob;

  if (!memo[cacheKey]) {
    memo[cacheKey] = glob.sync(options.glob, {cwd: dir}).sort(compare).map(file => ({
      path: path.resolve(dir, file),
      route: '/' + file.replace(options.indexFileRegExp, '')
    }));
  }

  return memo[cacheKey];
}

export = fsRoutes;
