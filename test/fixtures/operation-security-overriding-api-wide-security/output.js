export default createApi;
function createApi(options) {
  const basePath = '/v2';
  const endpoint = options.endpoint || 'http://petstore.swagger.io';
  const cors = !!options.cors;
  const mode = cors ? 'cors' : 'basic';
  const securityHandlers = options.securityHandlers || {};
  const handleSecurity = (security, headers, params, operationId) => {
    for (let i = 0, ilen = security.length; i < ilen; i++) {
      let scheme = security[i];
      let schemeParts = Object.keys(scheme);
      for (let j = 0, jlen = schemeParts.length; j < jlen; j++) {
        let schemePart = schemeParts[j];
        let fulfilsSecurityRequirements = securityHandlers[schemePart](
            headers, params, schemePart);
        if (fulfilsSecurityRequirements) {
          return;
        }

      }
    }
    throw new Error('No security scheme was fulfilled by the provided securityHandlers for operation ' + operationId);
  };
  const ensureRequiredSecurityHandlersExist = () => {
    let requiredSecurityHandlers = ['api_wide_auth','petstore_auth'];
    for (let i = 0, ilen = requiredSecurityHandlers.length; i < ilen; i++) {
      let requiredSecurityHandler = requiredSecurityHandlers[i];
      if (typeof securityHandlers[requiredSecurityHandler] !== 'function') {
        throw new Error('Expected to see a security handler for scheme "' +
            requiredSecurityHandler + '" in options.securityHandlers');
      }
    }
  };
  ensureRequiredSecurityHandlersExist();
  const buildQuery = (obj) => {
    return Object.keys(obj)
      .filter(key => typeof obj[key] !== 'undefined')
      .map((key) => {
        const value = obj[key];
        if (value === undefined) {
          return '';
        }
        if (value === null) {
          return key;
        }
        if (Array.isArray(value)) {
          if (value.length) {
            return key + '=' + value.map(encodeURIComponent).join('&' + key + '=');
          } else {
            return '';
          }
        } else {
          return key + '=' + encodeURIComponent(value);
        }
      }).join('&');
    };
  return {
    addPet(parameters) {
      const params = typeof parameters === 'undefined' ? {} : parameters;
      let headers = {
        'content-type': 'application/json',

      };
      handleSecurity([{"petstore_auth":["write:pets","read:pets"]}]
          , headers, params, 'addPet');
      return fetch(endpoint + basePath + '/pet'
        , {
          method: 'POST',
          headers,
          mode,
          body: JSON.stringify(params['body']),

        });
    },

  };
}
