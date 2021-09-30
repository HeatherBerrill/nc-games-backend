const express = require('express');
const commentsRouter = express.Router();
const {
  deleteComment,
  updateComment,
  getAllComments
} = require('../controllers/comments.controllers.js');

commentsRouter.route('/').get(getAllComments);
commentsRouter.route('/:comment_id').delete(deleteComment).patch(updateComment);

module.exports = commentsRouter;
