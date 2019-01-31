function post(req, res) {
  const { body } = req;
  const files = Object.keys(req.files).reduce((acc, field) => {
    acc[field] = req.files[field].map(({ originalname }) => ({ originalname }));
    return acc;
  }, {});
  res.json({ files, body });
}

module.exports = { post };
