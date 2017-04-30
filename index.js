var composites = require('composites');
var Program = composites.Program;
var Statement = composites.Statement;
var logPrefix = require('./package.json').name + ': ';

module.exports = buildApiService;

function buildApiService(apiDoc, options) {
  var apiFunctionDeclaration = new Program;
  var apiFunctionBody = new Program;
  var securityDefinitions = apiDoc.securityDefinitions;
  var requiredSecurityHandlers = [];
  var hasSecurity = apiDoc.security || function() {
    var paths = apiDoc.paths;
    var pathUris = (paths ? Object.keys(paths) : []);
    for (var i = 0, ilen = pathUris.length; i < ilen; i++) {
      var pathUri = pathUris[i];
      var path = paths[pathUri];
      var operations = (path ? Object.keys(path) : []);
      for (var j = 0, jlen = operations.length; j < jlen; j++) {
        var operation = path[operations[i]];
        if (operation && Array.isArray(operation.security)) {
          return true;
        }
      }
    }
    return false;
  }();
  if (apiDoc.security) {
    addToRequiredSecurityHandlers(requiredSecurityHandlers, apiDoc.security);
  }
  options = options || {preset: 'node'};

  if (options.preset === 'node') {
    apiFunctionDeclaration.push('\'use strict\';');
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
  if (hasSecurity) {
    apiFunctionDeclaration.push('  const securityHandlers = options.securityHandlers || {};');

    apiFunctionDeclaration.push('  const handleSecurity = (security, headers, params, operationId) => {');
    apiFunctionDeclaration.push('    for (let i = 0, ilen = security.length; i < ilen; i++) {');
    apiFunctionDeclaration.push('      let scheme = security[i];');
    apiFunctionDeclaration.push('      let schemeParts = Object.keys(scheme);');
    apiFunctionDeclaration.push('      for (let j = 0, jlen = schemeParts.length; j < jlen; j++) {');
    apiFunctionDeclaration.push('        let schemePart = schemeParts[j];');
    apiFunctionDeclaration.push('        let fulfilsSecurityRequirements = securityHandlers[schemePart](');
    apiFunctionDeclaration.push('            headers, params, schemePart);');
    apiFunctionDeclaration.push('        if (fulfilsSecurityRequirements) {');
    apiFunctionDeclaration.push('          return;');
    apiFunctionDeclaration.push('        }');
    apiFunctionDeclaration.push('');
    apiFunctionDeclaration.push('      }');
    apiFunctionDeclaration.push('    }');
    apiFunctionDeclaration.push('    throw new Error(\'No security scheme was fulfilled by the provided securityHandlers for operation \' + operationId);');
    apiFunctionDeclaration.push('  };');

    apiFunctionDeclaration.push('  const ensureRequiredSecurityHandlersExist = () => {');
    apiFunctionDeclaration.push('    let requiredSecurityHandlers = [', requiredSecurityHandlers, '];');
    apiFunctionDeclaration.push('    for (let i = 0, ilen = requiredSecurityHandlers.length; i < ilen; i++) {');
    apiFunctionDeclaration.push('      let requiredSecurityHandler = requiredSecurityHandlers[i];');
    apiFunctionDeclaration.push('      if (typeof securityHandlers[requiredSecurityHandler] !== \'function\') {');
    apiFunctionDeclaration.push('        throw new Error(\'Expected to see a security handler for scheme "\' +');
    apiFunctionDeclaration.push('            requiredSecurityHandler + \'" in options.securityHandlers\');');
    apiFunctionDeclaration.push('      }');
    apiFunctionDeclaration.push('    }');
    apiFunctionDeclaration.push('  };');
    apiFunctionDeclaration.push('  ensureRequiredSecurityHandlersExist();');
  }
  apiFunctionDeclaration.push('  const buildQuery = (obj) => {');
  apiFunctionDeclaration.push('    return Object.keys(obj)');
  apiFunctionDeclaration.push('      .filter(key => typeof obj[key] !== \'undefined\')');
  apiFunctionDeclaration.push('      .map((key) => {');
  apiFunctionDeclaration.push('        const value = obj[key];');
  apiFunctionDeclaration.push('        if (value === undefined) {');
  apiFunctionDeclaration.push('          return \'\';');
  apiFunctionDeclaration.push('        }');
  apiFunctionDeclaration.push('        if (value === null) {');
  apiFunctionDeclaration.push('          return key;');
  apiFunctionDeclaration.push('        }');
  apiFunctionDeclaration.push('        if (Array.isArray(value)) {');
  apiFunctionDeclaration.push('          if (value.length) {');
  apiFunctionDeclaration.push('            return key + \'=\' + value.map(encodeURIComponent).join(\'&\' + key + \'=\');');
  apiFunctionDeclaration.push('          } else {');
  apiFunctionDeclaration.push('            return \'\';');
  apiFunctionDeclaration.push('          }');
  apiFunctionDeclaration.push('        } else {');
  apiFunctionDeclaration.push('          return key + \'=\' + encodeURIComponent(value);');
  apiFunctionDeclaration.push('        }');
  apiFunctionDeclaration.push('      }).join(\'&\');');
  apiFunctionDeclaration.push('    };');
  apiFunctionDeclaration.push('  return {');
  apiFunctionDeclaration.push(apiFunctionBody);
  apiFunctionDeclaration.push('  };');
  apiFunctionDeclaration.push('}');

  generatePaths(apiDoc, options, apiFunctionBody, requiredSecurityHandlers);

  return apiFunctionDeclaration.toString();
}

function generatePaths(apiDoc, options, apiFunctionBody, requiredSecurityHandlers) {
  var paths = apiDoc.paths;
  Object.keys(paths).forEach(function(path) {
    var methods = paths[path];
    path = path.replace(/\{([^}]+)\}/g, '\' + params[\'$1\'] + \'');

    Object.keys(methods).forEach(function(method) {
      if (method === 'parameters' || method === '$ref') {
        return;
      }

      var methodDoc = methods[method];
      var security = methodDoc.security || apiDoc.security;

      addToRequiredSecurityHandlers(requiredSecurityHandlers, security);

      if (Array.isArray(methodDoc.parameters)) {
        var queryParams = methodDoc.parameters.filter(byQuery);
        var bodyParams = methodDoc.parameters.filter(byBodyParams);
        var headerParams = methodDoc.parameters.filter(byHeaders);
      }

      var body = new Program;
      var headers = new Program;
      var query = new Program;

      apiFunctionBody.push('    ' + methodDoc.operationId + '(parameters) {');
      apiFunctionBody.push('      const params = typeof parameters === \'undefined\' ? {} : parameters;');
      apiFunctionBody.push('      let headers = {');
      apiFunctionBody.push(headers);
      apiFunctionBody.push('      };');
      if (security && security.length) {
        apiFunctionBody.push('      handleSecurity(', JSON.stringify(security));
        apiFunctionBody.push('          , headers, params, \'', methodDoc.operationId, '\');');
      }
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
      apiFunctionBody.push('          headers,');
      apiFunctionBody.push('          mode,');

      if (bodyParams && bodyParams.length) {
        if (bodyParams[0].in === 'formData') {
          headers.push('        \'content-type\': \'application/x-www-form-urlencoded\',');
          body.push('          body: buildQuery({');
          bodyParams.filter(byFormData).forEach(function(param) {
            body.push('            \'', param.name, '\': params[\'', param.name, '\'],');
          });
          body.push('          }),');
        } else {
          headers.push('        \'content-type\': \'application/json\',');
          body.push('          body: JSON.stringify(params[\'' + bodyParams[0].name + '\']),');
        }

        apiFunctionBody.push(body);
      }

      if (headerParams && headerParams.length || bodyParams && bodyParams.length) {
        headerParams.forEach(function(param) {
          headers.push('        \'', param.name, '\': params[\'', param.name, '\'],');
        });
      }

      apiFunctionBody.push('        });');
      apiFunctionBody.push('    },');
    });
  });
}

function addToRequiredSecurityHandlers(requiredSecurityHandlers, security) {
  if (Array.isArray(security)) {
    security.forEach(function(scheme) {
      Object.keys(scheme).map(toQuoted).forEach(function(quoted) {
        if (requiredSecurityHandlers.indexOf(quoted) === -1) {
          requiredSecurityHandlers.push(quoted);
        }
      });
    });
    requiredSecurityHandlers.sort();
  }
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

function toQuoted(val) {
  return '\'' + val + '\'';
}
