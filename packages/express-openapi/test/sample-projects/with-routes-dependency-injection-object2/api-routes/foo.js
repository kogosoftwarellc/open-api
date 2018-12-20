module.exports = function(iamnotinjected) {
  var doc = {
    get: function(req, res, next) {
      res.status(200).send('foo');
    }
  };
  doc.get.apiDoc = {
    description: 'Get foo.',
    operationId: 'getFoo',
    parameters: [],
    responses: {
      200: {
        description: 'foo',
        schema: {
          type: 'string'
        }
      }
    }
  };
  return doc;
};
