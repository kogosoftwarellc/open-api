var glob = require('glob');
var path = require('path');
var memo = {};

module.exports = fsRoutes;

function fsRoutes(dir) {
  dir = path.resolve(process.cwd(), dir);

  if (!memo[dir]) {
    memo[dir] = glob.sync('**/*.js', {cwd: dir}).map(function(file) {
      return {
        path: path.resolve(dir, file),
        route: '/' + file.replace(/\.js$/, '')
      };
    });
  }

  return memo[dir];
}
