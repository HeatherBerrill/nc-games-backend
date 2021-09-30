const express = require('express');
const categoriesRouter = express.Router();
const {
  getCategories,
  postCategory
} = require('../controllers/categories.controllers.js');

categoriesRouter.route('/').get(getCategories).post(postCategory);

module.exports = categoriesRouter;
