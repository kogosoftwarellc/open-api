var Promise = require('bluebird');

// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  get: [
    // This is the name of the wrapper function.  Testing that it doesn't get
    // wrapped twice.
    function expressOpenapiPromiseMiddleware(req, res, next) {
      next();
    },
    function (req, res, next) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve([{ name: 'fred' }]);
        }, 1000);
      }).then(function (people) {
        res.status(200).json(people);
      });
    },
  ],

  post: function (req, res, next) {
    return new Promise(function (resolve, reject) {
      var err = new Error('something was missing');
      err.status = 400;
      reject(err);
    });
  },
};

module.exports.post.apiDoc = `
  description: 'Create a new user.'
  operationId: 'createUser'
  tags:
    - 'users'
    - 'creating'
  parameters: []
  responses:
    default:
      description: 'Unexpected error'
      schema:
        $ref: '#/definitions/Error'
`;
