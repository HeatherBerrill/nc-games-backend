const express = require('express');
const reviewsRouter = express.Router();
const {
  getReviews,
  postReview,
  getSingleReview,
  updateReviewVotes,
  deleteReview,
  getReviewComments,
  addCommentToReview
} = require('../controllers/reviews.controllers.js');

reviewsRouter.route('/').get(getReviews).post(postReview);
reviewsRouter
  .route('/:review_id')
  .get(getSingleReview)
  .patch(updateReviewVotes)
  .delete(deleteReview);

reviewsRouter
  .route('/:review_id/comments')
  .get(getReviewComments)
  .post(addCommentToReview);

module.exports = reviewsRouter;
