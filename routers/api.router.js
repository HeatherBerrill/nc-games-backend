const express = require('express');
const categoriesRouter = require('./categories.router.js');
const reviewsRouter = require('./reviews.router.js');
const commentsRouter = require('./comments.router.js');
const usersRouter = require('./users.router.js');
const apiRouter = express.Router();
const getJson = require('../controllers/api.controllers');

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.route('').get(getJson);

module.exports = apiRouter;
