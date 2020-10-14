const client = require('./client.js');
const { hash, compare } = require('bcrypt');

const createUser = async ({ username, password }) => {
	try {
		const hashedPass = await hash(password, 10);

		const {
			rows: [user]
		} = await client.query(
			`INSERT INTO users(username, password) VALUES($1, $2) RETURNING *`,
			[username, hashedPass]
		);

		delete user.password;

		return user;
	} catch (err) {
		throw err;
	}
};

const getUser = async ({ username, password }) => {
	try {
		const user = await getUserByUsername(username);
		const hashedPass = user.password;
		const match = await compare(password, hashedPass);

		if (match) {
			delete user.password;
			return user;
		}
	} catch (err) {
		throw err;
	}
};

const getUserByUsername = async username => {
	try {
		const {
			rows: [user]
		} = await client.query(
			`SELECT username, password, id FROM users WHERE username = $1`,
			[username]
		);

		return user;
	} catch (err) {
		throw err;
	}
};

const getUserById = async userId => {
	try {
		const {
			rows: [user]
		} = await client.query(`SELECT username, id FROM users WHERE id = $1`, [
			userId
		]);

		return user;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	createUser,
	getUser,
	getUserById,
	getUserByUsername
};
