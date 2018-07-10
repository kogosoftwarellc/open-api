var glob = require('glob');
var path = require('path');
var memo = {};

module.exports = fsRoutes;

function compare(a, b) {
  var result;
  a = {
    dirname: path.dirname(a).replace(/^\./i, ''),
    basename: path.basename(a).replace(/\:/i, '~')
  };
  b = {
    dirname: path.dirname(b).replace(/^\./i, ''),
    basename: path.basename(b).replace(/\:/i, '~')
  };

  if(a.dirname === b.dirname) {
    result = -1;
    if(a.basename > b.basename) {
      result = 1;
    }
  } else {
    result = 1;
    if(a.dirname < b.dirname) {
      result = -1;
    }
  }

  return result
}

function fsRoutes(dir, options) {
  dir = path.resolve(process.cwd(), dir);
  options = options || {};
  options.glob = options.glob || '**/*.js';
  options.indexFileRegExp = options.indexFileRegExp || /(?:index)?\.js$/;
  var cacheKey = dir + options.glob;

  if (!memo[cacheKey]) {
    memo[cacheKey] = glob.sync(options.glob, {cwd: dir}).sort(compare).map(function(file) {
      return {
        path: path.resolve(dir, file),
        route: '/' + file.replace(options.indexFileRegExp, '')
      };
    });
  }

  return memo[cacheKey];
}
