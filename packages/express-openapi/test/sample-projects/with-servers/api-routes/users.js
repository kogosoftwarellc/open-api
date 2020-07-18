module.exports = {
  get: [
    function (req, res, next) {
      res.status(200).json([{ name: 'fred' }]);
    },
  ],
};
