const db = require('../db/connection.js');

const selectCategories = async (p = 1, limit = 10) => {
  const offset = (p - 1) * limit;
  const categories = await db.query(
    'SELECT * FROM categories ORDER BY slug ASC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  return categories.rows;
};

const addNewCategory = async (slug, description) => {
  const inputCategory = await db.query(
    `INSERT INTO categories
    (slug, description)
    VALUES ($1, $2)
    RETURNING *;`,
    [slug, description]
  );

  const category = inputCategory.rows[0];
  return category;
};

module.exports = { selectCategories, addNewCategory };
