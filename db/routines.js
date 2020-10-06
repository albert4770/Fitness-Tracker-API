const client = require('./client');

const createRoutine = async ({ creatorId, isPublic, name, goal }) => {
	try {
		const {
			rows: [routine]
		} = await client.query(
			`INSERT INTO routines("creatorId", "isPublic", name, goal) VALUES($1, $2, $3, $4) RETURNING *`,
			[creatorId, isPublic, name, goal]
		);

		return routine;
	} catch (err) {
		throw err;
	}
};

const getRoutinesWithoutActivities = async () => {
	try {
		const { rows } = await client.query(`SELECT * FROM routines`);
		return rows;
	} catch (err) {
		throw err;
	}
};

module.exports = { createRoutine, getRoutinesWithoutActivities };
