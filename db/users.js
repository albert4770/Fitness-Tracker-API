const client = require('./client.js');

const createUser = async ({ username, password }) => {
	try {
		const {
			rows: [user]
		} = await client.query(
			`INSERT INTO users(username, password) VALUES($1, $2) RETURNING *`,
			[username, password]
		);

		return user;
	} catch (err) {
		throw err;
	}
};

module.exports = { createUser };
