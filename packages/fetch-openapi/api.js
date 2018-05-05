'use strict';
module.exports = createApi;
function createApi(options) {
  const basePath = '/v1';
  const endpoint = options.endpoint || '';
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
    let requiredSecurityHandlers = ['password','rememberMeToken'];
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
    return Object.keys(obj).map((key) => {
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
    getEntries(params) {
      let headers = {

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'getEntries');
      return fetch(endpoint + basePath + '/entries'
        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    createEntry(params) {
      let headers = {
        'content-type': 'application/json',

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'createEntry');
      return fetch(endpoint + basePath + '/entries'
        , {
          method: 'POST',
          headers,
          mode,
          body: JSON.stringify(params['entry']),

        });
    },
    getLabels(params) {
      let headers = {

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'getLabels');
      return fetch(endpoint + basePath + '/labels'
        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    createLabel(params) {
      let headers = {
        'content-type': 'application/json',

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'createLabel');
      return fetch(endpoint + basePath + '/labels'
        , {
          method: 'POST',
          headers,
          mode,
          body: JSON.stringify(params['label']),

        });
    },
    createRememberMeToken(params) {
      let headers = {

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'createRememberMeToken');
      return fetch(endpoint + basePath + '/rememberMeTokens'
        , {
          method: 'POST',
          headers,
          mode,
        });
    },
    createUser(params) {
      let headers = {
        'content-type': 'application/json',

      };
      return fetch(endpoint + basePath + '/users'
        , {
          method: 'POST',
          headers,
          mode,
          body: JSON.stringify(params['user']),

        });
    },
    deleteEntry(params) {
      let headers = {

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'deleteEntry');
      return fetch(endpoint + basePath + '/entries/' + params['entryId'] + ''
        , {
          method: 'DELETE',
          headers,
          mode,
        });
    },
    getEntry(params) {
      let headers = {

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'getEntry');
      return fetch(endpoint + basePath + '/entries/' + params['entryId'] + ''
        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    updateEntry(params) {
      let headers = {
        'content-type': 'application/json',

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'updateEntry');
      return fetch(endpoint + basePath + '/entries/' + params['entryId'] + ''
        , {
          method: 'PATCH',
          headers,
          mode,
          body: JSON.stringify(params['entry']),

        });
    },
    deleteLabel(params) {
      let headers = {

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'deleteLabel');
      return fetch(endpoint + basePath + '/labels/' + params['labelId'] + ''
        , {
          method: 'DELETE',
          headers,
          mode,
        });
    },
    updateLabel(params) {
      let headers = {
        'content-type': 'application/json',

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'updateLabel');
      return fetch(endpoint + basePath + '/labels/' + params['labelId'] + ''
        , {
          method: 'PATCH',
          headers,
          mode,
          body: JSON.stringify(params['label']),

        });
    },
    getUser(params) {
      let headers = {

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'getUser');
      return fetch(endpoint + basePath + '/users/' + params['userId'] + ''
        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    updateUser(params) {
      let headers = {
        'content-type': 'application/json',

      };
      handleSecurity([{"rememberMeToken":[]},{"password":[]}]
          , headers, params, 'updateUser');
      return fetch(endpoint + basePath + '/users/' + params['userId'] + ''
        , {
          method: 'PATCH',
          headers,
          mode,
          body: JSON.stringify(params['user']),

        });
    },
    deleteUserEmailVerificateToken(params) {
      let headers = {

      };
      return fetch(endpoint + basePath + '/users/' + params['userId'] + '/emailVerificationToken'
        , {
          method: 'DELETE',
          headers,
          mode,
        });
    },

  };
}
