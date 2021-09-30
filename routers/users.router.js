const express = require('express');
const usersRouter = express.Router();
const {
  getUsers,
  getSingleUser
} = require('../controllers/users.controllers.js');

usersRouter.route('/').get(getUsers);
usersRouter.route('/:username').get(getSingleUser);

module.exports = usersRouter;
