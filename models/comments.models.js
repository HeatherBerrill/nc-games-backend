const db = require('../db/connection.js');

const commentToDelete = async (comment_id) => {
  const comments = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [comment_id]
  );

  if (comments.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Sorry that comment does not exist'
    });
  } else {
    const deleted = await db.query(
      `DELETE FROM comments 
  WHERE comment_id = $1`,
      [comment_id]
    );

    return deleted.rows;
  }
};

const commentToUpdate = async (comment_id, votes) => {
  const regex = /^[0-9]*$/g;
  if (regex.test(comment_id) === false) {
    return Promise.reject({
      status: 400,
      msg: 'Sorry that is not a valid id'
    });
  }

  const comments = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [comment_id]
  );

  if (comments.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Sorry that comment does not exist'
    });
  } else {
    const updatedComment = await db.query(
      'UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;',
      [votes, comment_id]
    );

    return updatedComment;
  }
};

const selectAllComments = async (p = 1, limit = 10) => {
  const offset = (p - 1) * limit;

  const comments = await db.query(
    'SELECT * FROM comments ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return comments.rows;
};

module.exports = { commentToDelete, commentToUpdate, selectAllComments };
