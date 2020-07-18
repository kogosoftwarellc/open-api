module.exports = {
  get: function (req, res, next) {
    res.status(200).send(req.boo + req.boo2);
  },
};
