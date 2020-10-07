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

const updateActivity = async ({ id, name, description }) => {
	try {
		const {
			rows: [updatedActivity]
		} = await client.query(
			`UPDATE activities SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
			[name, description, id]
		);

		return updatedActivity;
	} catch (err) {
		throw err;
	}
};

module.exports = { createActivity, getAllActivities, updateActivity };
