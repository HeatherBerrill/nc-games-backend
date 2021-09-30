const {
  selectReviews,
  selectSingleReview,
  addNewReview,
  patchReviewToUpdate,
  selectReviewComments,
  postCommentToReview,
  reviewToDelete
} = require('../models/reviews.models.js');

const getReviews = (req, res, next) => {
  const { category } = req.query;
  const { sortOrder } = req.query;
  const { limit } = req.query;
  const { sortBy } = req.query;
  const { p } = req.query;

  selectReviews(p, sortBy, sortOrder, limit, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((error) => {
      next(error);
    });
};

const getSingleReview = (req, res, next) => {
  const { review_id } = req.params;

  selectSingleReview(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

const postReview = (req, res, next) => {
  const { owner } = req.body;
  const { title } = req.body;
  const { review_body } = req.body;
  const { designer } = req.body;
  const { category } = req.body;
  const { review_img_url } = req.body;

  addNewReview(owner, review_img_url, title, review_body, designer, category)
    .then((review) => {
      res.status(201).send(review);
    })
    .catch((error) => {
      next(error);
    });
};

const updateReviewVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { review_id } = req.params;

  patchReviewToUpdate(review_id, inc_votes)
    .then((result) => {
      const review = result.rows;
      res.status(200).send(review);
    })
    .catch((error) => {
      next(error);
    });
};

const getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  const { limit } = req.query;
  const { p } = req.query;

  selectReviewComments(p, review_id, limit)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((error) => {
      next(error);
    });
};

const addCommentToReview = (req, res, next) => {
  const comment = req.body;
  const { review_id } = req.params;
  postCommentToReview(review_id, comment)
    .then((result) => {
      const comment = result[0];

      res.status(201).send(comment);
    })
    .catch((error) => {
      next(error);
    });
};

const deleteReview = (req, res, next) => {
  const { review_id } = req.params;
  reviewToDelete(review_id)
    .then((review) => {
      res.status(204).send('review deleted');
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getReviews,
  postReview,
  getSingleReview,
  updateReviewVotes,
  getReviewComments,
  addCommentToReview,
  deleteReview
};
