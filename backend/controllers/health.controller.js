exports.checkHealth = (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is healthy'
  });
};
