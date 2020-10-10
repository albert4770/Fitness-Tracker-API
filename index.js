// create the express server here
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const client = require('./db/client');
require('dotenv').config();

const server = express();
const { PORT = 3000 } = process.env;
const { apiRouter } = require('./api/index');

server.use(express.json());
server.use(morgan('dev'));
server.use(cors());
server.use('/api', apiRouter);

server.use((req, res) => {
	res.sendStatus(404);
});

server.use((error, req, res, next) => {
	console.log(error);
	res.status(500).send(error);
});

server.listen(PORT, () => {
	client.connect();
	console.log(`Listening on port ${PORT}`);
});
