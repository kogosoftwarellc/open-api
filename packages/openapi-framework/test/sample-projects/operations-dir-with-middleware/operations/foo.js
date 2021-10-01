module.exports = [
  (req, res, next) => {
    return next();
  },
  function getFoo() {
    return;
  },
];
