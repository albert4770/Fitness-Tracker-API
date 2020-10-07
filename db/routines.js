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

const getAllRoutines = async () => {
	try {
		const { rows: routines } = await client.query(
			`select routines.id, "creatorId", "isPublic", name, goal, users.username as "creatorName" from routines left join users on routines."creatorId" = users.id`
		);

		const { rows: rActivities } = await client.query(
			`select * from routine_activities left join activities on routine_activities."activityId" = activities.id`
		);

		routines.forEach(routine => {
			routine.activities = [];

			rActivities.forEach(rActivity => {
				if (routine.id === rActivity.routineId) {
					routine.activities.push(rActivity);
				}
			});
		});

		// console.log('Get all routines log', routines);
		return routines;
	} catch (err) {
		throw err;
	}
};

const getAllPublicRoutines = async () => {
	try {
		const { rows: routines } = await client.query(
			`select routines.id, "creatorId", "isPublic", name, goal, users.username as "creatorName" from routines left join users on routines."creatorId" = users.id where "isPublic" = true`
		);

		const { rows: rActivities } = await client.query(
			`select * from routine_activities left join activities on routine_activities."activityId" = activities.id`
		);

		routines.forEach(routine => {
			routine.activities = [];

			rActivities.forEach(rActivity => {
				if (routine.id === rActivity.routineId) {
					routine.activities.push(rActivity);
				}
			});

			// return routine.isPublic;
		});

		return routines;
	} catch (err) {
		throw err;
	}
};

const getPublicRoutinesByUser = async ({ username }) => {
	try {
		const {
			rows: routines
		} = await client.query(
			`select routines.id, "creatorId", "isPublic", name, goal, users.username as "creatorName" from routines left join users on routines."creatorId" = users.id where "isPublic" = true and users.username = $1`,
			[username]
		);

		const { rows: rActivities } = await client.query(
			`select * from routine_activities left join activities on routine_activities."activityId" = activities.id`
		);

		routines.forEach(routine => {
			routine.activities = [];

			rActivities.forEach(rActivity => {
				if (routine.id === rActivity.routineId) {
					routine.activities.push(rActivity);
				}
			});

			// return routine.isPublic;
		});

		return routines;
	} catch (err) {
		throw err;
	}
};

const getAllRoutinesByUser = async ({ username }) => {
	try {
		const {
			rows: routines
		} = await client.query(
			`select routines.id, "creatorId", "isPublic", name, goal, users.username as "creatorName" from routines left join users on routines."creatorId" = users.id where users.username = $1`,
			[username]
		);

		const { rows: rActivities } = await client.query(
			`select * from routine_activities left join activities on routine_activities."activityId" = activities.id`
		);

		routines.forEach(routine => {
			routine.activities = [];

			rActivities.forEach(rActivity => {
				if (routine.id === rActivity.routineId) {
					routine.activities.push(rActivity);
				}
			});

			// return routine.isPublic;
		});

		return routines;
	} catch (err) {
		throw err;
	}
};

// const getAllRoutinesByUser;
// const getPublicRoutinesByUser;
// const getPublicRoutinesByActivity;
// const updateRoutine;
// const destroyRoutine;

module.exports = {
	createRoutine,
	getRoutinesWithoutActivities,
	getAllRoutines,
	getAllPublicRoutines,
	getPublicRoutinesByUser,
	getAllRoutinesByUser
};

// Expected: ObjectContaining {"activities": Any<Array>, "creatorId": Any<Number>, "goal": Any<String>, "id": Any<Number>, "isPublic": Any<Boolean>, "name": Any<String>}
