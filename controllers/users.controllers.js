const { selectUsers, selectSingleUser } = require('../models/users.models.js');

const getUsers = (req, res, next) => {
  const { limit } = req.query;
  const { p } = req.query;
  selectUsers(p, limit)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
};

const getSingleUser = (req, res, next) => {
  const { username } = req.params;

  selectSingleUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getUsers, getSingleUser };
