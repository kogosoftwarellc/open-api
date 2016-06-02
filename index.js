var composites = require('composites');
var Program = composites.Program;
var Statement = composites.Statement;
var logPrefix = require('./package.json').name + ': ';

module.exports = buildApiService;

function buildApiService(apiDoc, options) {
  var apiFunctionDeclaration = new Program;
  var apiFunctionBody = new Program;
  options = options || {preset: 'node'};

  if (options.preset === 'node') {
    apiFunctionDeclaration.push('module.exports = createApi;');
  } else if (options.preset === 'es6') {
    apiFunctionDeclaration.push('export default createApi;');
  } else {
    throw new Error(logPrefix + 'Unknown preset "' + options.preset + '"');
  }

  apiFunctionDeclaration.push('function createApi(options) {');
  apiFunctionDeclaration.push('  const basePath = \'' + apiDoc.basePath + '\';');
  apiFunctionDeclaration.push(
      '  const endpoint = options.endpoint || \'' + getEndpoint(apiDoc) + '\';');
  apiFunctionDeclaration.push('  const cors = !!options.cors;');
  apiFunctionDeclaration.push('  const mode = cors ? \'cors\' : \'basic\';');

  apiFunctionDeclaration.push('  const buildQuery = (obj) => {');
  apiFunctionDeclaration.push('    return Object.keys(obj).map((key) => {');
  apiFunctionDeclaration.push('      const value = obj[key];');
  apiFunctionDeclaration.push('      if (value === undefined) {');
  apiFunctionDeclaration.push('        return \'\';');
  apiFunctionDeclaration.push('      }');
  apiFunctionDeclaration.push('      if (value === null) {');
  apiFunctionDeclaration.push('        return key;');
  apiFunctionDeclaration.push('      }');
  apiFunctionDeclaration.push('      if (Array.isArray(value)) {');
  apiFunctionDeclaration.push('        if (value.length) {');
  apiFunctionDeclaration.push('          return key + \'=\' + value.map(encodeURIComponent).join(\'&\' + key + \'=\');');
  apiFunctionDeclaration.push('        } else {');
  apiFunctionDeclaration.push('          return \'\';');
  apiFunctionDeclaration.push('        }');
  apiFunctionDeclaration.push('      } else {');
  apiFunctionDeclaration.push('        return key + \'=\' + encodeURIComponent(value);');
  apiFunctionDeclaration.push('      }');
  apiFunctionDeclaration.push('    }).join(\'&\');');
  apiFunctionDeclaration.push('  };');
  apiFunctionDeclaration.push('  return {');
  apiFunctionDeclaration.push(apiFunctionBody);
  apiFunctionDeclaration.push('  };');
  apiFunctionDeclaration.push('}');

  generatePaths(apiDoc, options, apiFunctionBody);

  return apiFunctionDeclaration.toString();
}

function generatePaths(apiDoc, options, apiFunctionBody) {
  var paths = apiDoc.paths;
  Object.keys(paths).forEach(function(path) {
    var methods = paths[path];
    path = path.replace(/\{([^}]+)\}/g, '\' + params[\'$1\'] + \'');
    Object.keys(methods).forEach(function(method) {
      var methodDoc = methods[method];

      if (!Array.isArray(methodDoc.parameters)) {
        return;
      }

      var queryParams = methodDoc.parameters.filter(byQuery);
      var bodyParams = methodDoc.parameters.filter(byBodyParams);
      var headerParams = methodDoc.parameters.filter(byHeaders);
      var body = new Program;
      var headers = new Program;
      var query = new Program;

      apiFunctionBody.push('    ' + methodDoc.operationId + '(params) {');
      apiFunctionBody.push('      return fetch(endpoint + basePath + \'' + path + '\'', query);

      if (queryParams && queryParams.length) {
        query.push(' + \'?\' + buildQuery({');
        queryParams.forEach(function(param) {
          query.push('          \'', param.name, '\': params[\'', param.name, '\'],');
        });
        query.push('        })');
      }
      apiFunctionBody.push('        , {');
      apiFunctionBody.push('          method: \'', method.toUpperCase(), '\',');
      apiFunctionBody.push('          headers: {');
      apiFunctionBody.push(headers);

      apiFunctionBody.push('          },');
      apiFunctionBody.push('          mode,');

      if (bodyParams && bodyParams.length) {
        if (bodyParams[0].in === 'formData') {
          headers.push('            \'content-type\': \'application/x-www-form-urlencoded\',');
          body.push('          body: buildQuery({');
          bodyParams.filter(byFormData).forEach(function(param) {
            body.push('            \'', param.name, '\': params[\'', param.name, '\'],');
          });
          body.push('          }),');
        } else {
          headers.push('            \'content-type\': \'application/json\',');
          body.push('          body: JSON.stringify(params[\'' + bodyParams[0].name + '\']),');
        }

        apiFunctionBody.push(body);
      }

      if (headerParams && headerParams.length || bodyParams && bodyParams.length) {
        headerParams.forEach(function(param) {
          headers.push('            \'', param.name, '\': params[\'', param.name, '\'],');
        });
      }



      apiFunctionBody.push('        });');
      apiFunctionBody.push('    },');
    });
  });
}

function byBodyParams(param) {
  return param.in === 'body' || param.in === 'formData';
}

function byFormData(param) {
  return param.in === 'formData';
}

function byHeaders(param) {
  return param.in === 'header';
}

function byQuery(param) {
  return param && param.in === 'query';
}

function getEndpoint(apiDoc) {
  var scheme = Array.isArray(apiDoc.schemes) ?
      apiDoc.schemes[0] :
      null;
  if (scheme && apiDoc.host) {
    return scheme + '://' + apiDoc.host;
  }
  return '';
}
