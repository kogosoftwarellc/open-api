'use strict';
module.exports = createApi;
function createApi(options) {
  const basePath = '/v2';
  const endpoint = options.endpoint || 'http://petstore.swagger.io';
  const cors = !!options.cors;
  const mode = cors ? 'cors' : 'basic';
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
    addPet(params) {
      let headers = {
        'content-type': 'application/json',

      };
      return fetch(endpoint + basePath + '/pet'
        , {
          method: 'POST',
          headers,
          mode,
          body: JSON.stringify(params['body']),

        });
    },
    updatePet(params) {
      let headers = {
        'content-type': 'application/json',

      };
      return fetch(endpoint + basePath + '/pet'
        , {
          method: 'PUT',
          headers,
          mode,
          body: JSON.stringify(params['body']),

        });
    },
    findPetsByStatus(params) {
      let headers = {

      };
      return fetch(endpoint + basePath + '/pet/findByStatus' + '?' + buildQuery({
          'status': params['status'],
        })

        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    findPetsByTags(params) {
      let headers = {

      };
      return fetch(endpoint + basePath + '/pet/findByTags' + '?' + buildQuery({
          'tags': params['tags'],
        })

        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    getPetById(params) {
      let headers = {

      };
      return fetch(endpoint + basePath + '/pet/' + params['petId'] + ''
        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    updatePetWithForm(params) {
      let headers = {
        'content-type': 'application/x-www-form-urlencoded',

      };
      return fetch(endpoint + basePath + '/pet/' + params['petId'] + ''
        , {
          method: 'POST',
          headers,
          mode,
          body: buildQuery({
            'name': params['name'],
            'status': params['status'],
          }),

        });
    },
    deletePet(params) {
      let headers = {
        'api_key': params['api_key'],

      };
      return fetch(endpoint + basePath + '/pet/' + params['petId'] + ''
        , {
          method: 'DELETE',
          headers,
          mode,
        });
    },

  };
}
