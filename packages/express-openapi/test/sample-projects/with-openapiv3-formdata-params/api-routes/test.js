'use strict';

module.exports = {
  post: function (req, res, next) {
    res.send(req.body);
  },
};
