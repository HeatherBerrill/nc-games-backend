const db = require('../db/connection.js');

const selectReviews = async (
  p = 1,
  sortBy = 'created_at',
  sortOrder = 'DESC',
  limit = 10,
  category
) => {
  const validColumns = [
    'review_id',
    'title',
    'designer',
    'owner',
    'review_img_url',
    'review_body',
    'category',
    'created_at',
    'votes',
    'comment_count'
  ];

  if (!validColumns.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: 'cannot sort that way, sorry!' });
  }

  const validSortOrder = ['DESC', 'ASC'];

  if (sortOrder && !validSortOrder.includes(sortOrder)) {
    return Promise.reject({
      status: 400,
      msg: 'cannot order that way, sorry!'
    });
  }

  if (limit) {
    const regex = /^[0-9]*$/g;
    if (regex.test(limit) === false) {
      return Promise.reject({
        status: 400,
        msg: 'that is not a valid limit, sorry!'
      });
    }
  }

  const offset = (p - 1) * limit;

  let queryStr = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
  FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY ${sortBy} ${sortOrder} LIMIT ${limit} OFFSET ${offset};`;

  const validCategories = [
    'engine-building',
    'deck-building',
    'dexterity',
    'social deduction',
    "children's games",
    'euro game',
    'strategy',
    'hidden-roles',
    'push-your-luck',
    'roll-and-write'
  ];

  if (category && validCategories.includes(category)) {
    queryStr = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
    FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id
    WHERE reviews.category = '${category}'
    GROUP BY reviews.review_id
    ORDER BY ${sortBy} ${sortOrder} LIMIT ${limit} OFFSET ${offset};`;
  } else if (category && !validCategories.includes(category)) {
    return Promise.reject({ status: 404, msg: 'this is not a valid category' });
  }
  const result = await db.query(queryStr);
  const reviews = result.rows;

  return reviews;
};

const getCommentsForReview = async function (review_id) {
  const result = await db.query('SELECT * FROM comments WHERE review_id = $1', [
    review_id
  ]);
  const commentCount = result.rows.length;
  return commentCount;
};

const selectSingleReview = async (review_id) => {
  const regex = /^[0-9]*$/g;
  if (regex.test(review_id) === false) {
    return Promise.reject({
      status: 400,
      msg: 'Sorry that is not a valid id'
    });
  } else {
    const commentCount = await getCommentsForReview(review_id);

    const getReview = await db.query(
      `SELECT * FROM reviews WHERE review_id = $1;`,
      [review_id]
    );

    if (getReview.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: 'Sorry that review does not exist'
      });
    } else {
      const review = getReview.rows[0];
      review.comment_count = commentCount;
      return review;
    }
  }
};

const addNewReview = async (
  owner,
  review_img_url,
  title,
  review_body,
  designer,
  category
) => {
  const votes = 0;

  const queryStr = `INSERT INTO reviews
    (title, designer, owner, review_img_url, review_body, category, created_at, votes)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7)
    RETURNING review_id, votes, created_at;`;
  const values = [
    title,
    designer,
    owner,
    review_img_url,
    review_body,
    category,
    votes
  ];

  const newReview = await db.query(queryStr, values);

  const review = newReview.rows[0];
  review.comment_count = 0;
  return review;
};

const patchReviewToUpdate = async (review_id, votes) => {
  const regex = /^[0-9]*$/g;
  if (regex.test(review_id) === false) {
    return Promise.reject({
      status: 400,
      msg: 'Sorry that is not a valid id'
    });
  }

  const regex2 = /^[0-9]*$/g;

  if (votes && regex2.test(votes) === false) {
    return Promise.reject({
      status: 400,
      msg: 'Sorry that is not a valid input'
    });
  }

  if (votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: 'You are missing required fields'
    });
  }

  const updatedReview = await db.query(
    'UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;',
    [votes, review_id]
  );

  return updatedReview;
};

const selectReviewComments = async (p = 1, review_id, limit = 10) => {
  const offset = (p - 1) * limit;

  const regex = /^[0-9]*$/g;
  if (regex.test(review_id) === false) {
    return Promise.reject({
      status: 400,
      msg: 'Sorry that is not a valid id'
    });
  }

  const getReview = await db.query(
    `SELECT * FROM reviews WHERE review_id = $1;`,
    [review_id]
  );

  if (getReview.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Sorry that review does not exist'
    });
  }

  const result = await db.query(
    'SELECT comment_id, votes, created_at, author, body  FROM comments WHERE review_id = $1 LIMIT $2 OFFSET $3',
    [review_id, limit, offset]
  );
  const comments = result.rows;
  return comments;
};

const postCommentToReview = async (review_id, comment) => {
  const username = comment.username;
  const votes = 0;
  const body = comment.body;

  const regex = /^[0-9]*$/g;
  if (regex.test(review_id) === false) {
    return Promise.reject({
      status: 400,
      msg: 'Sorry that is not a valid id'
    });
  }

  const getReview = await db.query(
    `SELECT * FROM reviews WHERE review_id = $1;`,
    [review_id]
  );

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: 'You are missing required fields'
    });
  }

  if (getReview.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Sorry that review does not exist'
    });
  }

  const values = [username, review_id, votes, body];

  const queryStr = `INSERT INTO comments
    (author, review_id, votes, created_at, body)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
    RETURNING *;`;

  const newComments = await db.query(queryStr, values);
  return newComments.rows;
};

const reviewToDelete = async (review_id) => {
  const reviews = await db.query(`SELECT * FROM reviews WHERE review_id = $1`, [
    review_id
  ]);

  if (reviews.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Sorry that review does not exist'
    });
  } else {
    const deleted = await db.query(
      `DELETE FROM reviews 
  WHERE review_id = $1`,
      [review_id]
    );
    return deleted.rows;
  }
};

module.exports = {
  selectReviews,
  selectSingleReview,
  addNewReview,
  getCommentsForReview,
  patchReviewToUpdate,
  selectReviewComments,
  postCommentToReview,
  reviewToDelete
};
