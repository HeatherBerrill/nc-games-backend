const db = require('../db/connection.js');

const selectUsers = async (p = 1, limit = 10) => {
  const offset = (p - 1) * limit;

  const users = await db.query(
    'SELECT username FROM users ORDER BY username ASC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  return users.rows;
};

const selectSingleUser = async (username) => {
  const getUser = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username
  ]);
  if (getUser.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Sorry that user does not exist'
    });
  } else {
    const user = getUser.rows[0];

    return user;
  }
};

module.exports = { selectUsers, selectSingleUser };
