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

function fsRoutes(dir) {
  dir = path.resolve(process.cwd(), dir);

  if (!memo[dir]) {
    memo[dir] = glob.sync('**/*.js', {cwd: dir}).sort(compare).map(function(file) {
      return {
        path: path.resolve(dir, file),
        route: '/' + file.replace(/(?:index)?\.js$/, '')
      };
    });
  }

  return memo[dir];
}
