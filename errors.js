exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status !== undefined) {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
};

exports.handleRouter404s = (req, res, next) => {
  res
    .status(404)
    .send({ message: "Sorry the path you've chosen does not exist" });
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'Spontaneous Server Combustion' });
};
