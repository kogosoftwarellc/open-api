module.exports = function(/*no params*/) {

  var doc = {
    get: function(req, res, next) {
      res.status(200).send('boo');
    }
  };
  doc.get.apiDoc = {
    description: "Get foo.",
    operationId: 'getFoo',
    parameters: [],
    responses: {
      200: {
        description: "foo",
        schema: {
          type: 'string'
        }
      }
    }
  };
  return doc;
};


