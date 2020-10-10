// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require('express');
const apiRouter = express.Router();
const { usersRouter } = require('./users');

apiRouter.use('/users', usersRouter);

apiRouter.get('/health', (req, res, next) => {
	res.send('Server is up and running');
});

module.exports = { apiRouter };
