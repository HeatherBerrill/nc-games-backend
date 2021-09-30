const db = require('../connection.js');
const {
  formatUsersData,
  formatCategoriesData,
  formatReviewsData,
  formatCommentsData,
  createReviewRefObj
} = require('../utils/data-manipulation.js');
const format = require('pg-format');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS categories;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  await db.query(`CREATE TABLE users (
    username VARCHAR(250) PRIMARY KEY UNIQUE NOT NULL, 
    avatar_url VARCHAR, 
    name VARCHAR(250)
  );`);

  await db.query(`CREATE TABLE categories (
    slug VARCHAR(40) PRIMARY KEY UNIQUE NOT NULL, 
    description VARCHAR
  );`);

  await db.query(`CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY, 
  title VARCHAR(100) NOT NULL, 
  review_body VARCHAR NOT NULL, 
  designer VARCHAR(50) NOT NULL, 
  review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
  votes SMALLINT DEFAULT 0, 
  category VARCHAR REFERENCES categories(slug), 
  owner VARCHAR(250) REFERENCES users(username), 
  created_at TIMESTAMP DEFAULT NOW()
)`);

  await db.query(`CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY, 
  author VARCHAR(250) REFERENCES users(username),
  review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  body VARCHAR NOT NULL
)`);
  // inserting users data
  const formattedUsersData = formatUsersData(userData);
  const stringForQueryUsers = format(
    `INSERT INTO users 
  (username, name, avatar_url) 
  VALUES %L 
  RETURNING *;`,
    formattedUsersData
  );
  await db.query(stringForQueryUsers);

  // inserting categories data

  const formattedCategoriesData = formatCategoriesData(categoryData);
  const stringForQueryCategories = format(
    `INSERT INTO categories
  (slug, description) 
  VALUES %L 
  RETURNING *;`,
    formattedCategoriesData
  );
  await db.query(stringForQueryCategories);

  // inserting reviews data

  const formattedReviewsData = formatReviewsData(reviewData);
  const stringForQueryReviews = format(
    `INSERT INTO reviews
  (title, designer, owner, review_img_url, review_body, category, created_at, votes) 
  VALUES %L 
  RETURNING *;`,
    formattedReviewsData
  );
  const result = await db.query(stringForQueryReviews);
  const insertedReviews = result.rows;
  const reviewRefObj = createReviewRefObj(insertedReviews);

  const formattedCommentsData = formatCommentsData(commentData, reviewRefObj);
  const stringForQueryComments = format(
    `INSERT INTO comments
(author, review_id, votes, created_at, body) 
VALUES %L 
RETURNING *;`,
    formattedCommentsData
  );
  await db.query(stringForQueryComments);
  await db.query(`SELECT * FROM reviews;`).then((tableData) => {});
};

module.exports = seed;
