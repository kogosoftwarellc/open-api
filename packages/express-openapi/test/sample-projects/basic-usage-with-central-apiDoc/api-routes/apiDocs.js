module.exports = {
  get: function get(req, res, next) {
    if (req.query.type === 'apiDoc') {
      return res.json(req.apiDoc);
    }
    return res.json(req.operationDoc);
  }
};
