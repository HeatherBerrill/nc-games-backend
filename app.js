const express = require('express');
const apiRouter = require('./routers/api.router.js');
const cors = require('cors');
const {
  handleRouter404s,
  handle500s,
  handleCustomErrors
} = require('./errors.js');
const app = express();

app.use(cors());
//body parsing middleware
app.use(express.json());

//routers
app.use('/api', apiRouter);

app.use('/*', handleRouter404s);

//error handlers
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
