const client = require('./client');

const createActivity = async ({ name, description }) => {
	try {
		const {
			rows: [activity]
		} = await client.query(
			`INSERT INTO activities(name, description) VALUES($1, $2) RETURNING *`,
			[name, description]
		);

		return activity;
	} catch (err) {
		throw err;
	}
};

const getAllActivities = async () => {
	try {
		const { rows } = await client.query(`SELECT * FROM activities`);
		return rows;
	} catch (err) {
		throw err;
	}
};

module.exports = { createActivity, getAllActivities };
