const json = require('../endpoints.json');

const getJson = (req, res, next) => {
  res
    .status(200)
    .send(json)
    .catch((error) => {
      next(error);
    });
};

module.exports = getJson;
