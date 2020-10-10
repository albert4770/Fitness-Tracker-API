const express = require('express');
const usersRouter = express.Router();

usersRouter.post('/register', (req, res, next) => {
	console.log(req.body);
	res.send('register!');
});

module.exports = { usersRouter };
