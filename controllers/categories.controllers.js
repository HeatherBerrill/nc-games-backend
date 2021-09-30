const {
  selectCategories,
  addNewCategory
} = require('../models/categories.models.js');

const getCategories = (req, res, next) => {
  const { limit } = req.query;
  const { p } = req.query;
  selectCategories(p, limit)
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((error) => {
      next(error);
    });
};

const postCategory = (req, res, next) => {
  const { slug } = req.body;
  const { description } = req.body;

  addNewCategory(slug, description)
    .then((category) => {
      res.status(201).send(category);
    })
    .catch((error) => {
      next(error);
    });
};
module.exports = { getCategories, postCategory };
