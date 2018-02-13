module.exports = {
  // method handlers may just be the method handler...
  get: get,
  // or they may also be an array of middleware + the method handler.  This allows
  // for flexible middleware management.  express-openapi middleware generated from
  // the <path>.parameters + <methodHandler>.apiDoc.parameters is prepended to this
  // array.
  post: [function(req, res, next) {next();}, post]
};

function post(req, res) {
  res.status(200).json({id: req.params.id});
}

function get(req, res) {
  res.status(200).json({
    id: req.params.id,
    name: req.query.name,
    age: req.query.age
  });
}
