const {
  commentToDelete,
  commentToUpdate,
  selectAllComments
} = require('../models/comments.models.js');

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  commentToDelete(comment_id)
    .then((comments) => {
      res.status(204).send('comment deleted');
    })
    .catch((error) => {
      next(error);
    });
};

const updateComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  commentToUpdate(comment_id, inc_votes)
    .then((result) => {
      const comment = result.rows;
      res.status(200).send(comment);
    })
    .catch((error) => {
      next(error);
    });
};

const getAllComments = (req, res, next) => {
  const { limit } = req.query;
  const { p } = req.query;
  selectAllComments(p, limit)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { deleteComment, updateComment, getAllComments };
