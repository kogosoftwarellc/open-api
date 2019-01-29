function post(req, res) {
  const { body } = req;
  const files = req.files.map(({ fieldname, originalname }) => ({
    fieldname,
    originalname
  }));
  res.json({ files, body });
}

module.exports = { post };
