const client = require('./client');

const addActivityToRoutine = async ({
	routineId,
	activityId,
	count,
	duration
}) => {
	try {
		const {
			rows: [routineActivity]
		} = await client.query(
			`INSERT INTO routine_activities("routineId", "activityId", count, duration) 
            VALUES($1, $2, $3, $4) RETURNING *`,
			[routineId, activityId, count, duration]
		);

		return routineActivity;
	} catch (err) {
		throw err;
	}
};

const updateRoutineActivity = async ({ id, count, duration }) => {
	let updateFields = {};

	if (count) {
		updateFields.count = count;
	}

	if (duration) {
		updateFields.duration = duration;
	}

	const setString = Object.keys(updateFields)
		.map((key, i) => {
			return `${key}=$${i + 1}`;
		})
		.join(', ');

	try {
		const {
			rows: [updatedRoutine]
		} = await client.query(
			`update routine_activities set ${setString} where id = ${id} returning *`,
			Object.values(updateFields)
		);

		return updatedRoutine;
	} catch (err) {
		throw err;
	}
};

const destroyRoutineActivity = async id => {
	try {
		const {
			rows: [deleted]
		} = await client.query(
			`delete from routine_activities where id = $1 returning *`,
			[id]
		);

		return deleted;
	} catch (err) {
		throw err;
	}
};

const getRoutineActivityById = async id => {
	try {
		const {
			rows: [routineActivity]
		} = await client.query(
			'select "routineId" from routine_activities where id = $1',
			[id]
		);

		return routineActivity;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	addActivityToRoutine,
	updateRoutineActivity,
	destroyRoutineActivity,
	getRoutineActivityById
};
