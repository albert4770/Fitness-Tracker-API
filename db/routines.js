const client = require('./client');

const createRoutine = async ({ creatorId, isPublic, name, goal }) => {
	try {
		const {
			rows: [routine]
		} = await client.query(
			`INSERT INTO routines("creatorId", "isPublic", name, goal) 
            VALUES($1, $2, $3, $4) RETURNING *`,
			[creatorId, isPublic, name, goal]
		);

		return routine;
	} catch (err) {
		throw err;
	}
};

const updateRoutine = async ({ id, isPublic, name, goal }) => {
	updateFields = {};

	if (isPublic) {
		updateFields.isPublic = isPublic;
	}
	if (name) {
		updateFields.name = name;
	}
	if (goal) {
		updateFields.goal = goal;
	}

	const setString = Object.keys(updateFields)
		.map((key, i) => {
			return `"${key}"=$${i + 1}`;
		})
		.join(', ');

	try {
		const {
			rows: [routine]
		} = await client.query(
			`update routines set ${setString} where id = ${id} returning *`,
			Object.values(updateFields)
		);

		return routine;
	} catch (err) {
		throw err;
	}
};

const destroyRoutine = async routineId => {
	try {
		const {
			rows: [deletedRoutine]
		} = await client.query(
			`delete from routines where id = $1 returning *`,
			[routineId]
		);

		await client.query(
			`delete from routine_activities where "routineId" = $1`,
			[routineId]
		);

		return deletedRoutine;
	} catch (err) {
		throw err;
	}
};

const getRoutineActivitiesByRoutine = async ({ id }) => {
	try {
		const {
			rows
		} = await client.query(
			`select * from routine_activities where "routineId" = $1`,
			[id]
		);
		return rows;
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
			`select routines.id, "creatorId", "isPublic", name, goal, users.username as "creatorName" from routines 
            left join users on routines."creatorId" = users.id`
		);

		const { rows: rActivities } = await client.query(
			`select * from routine_activities 
            left join activities on routine_activities."activityId" = activities.id`
		);

		return addActivitiesToRoutines(routines, rActivities);
	} catch (err) {
		throw err;
	}
};

const getAllPublicRoutines = async () => {
	try {
		const { rows: routines } = await client.query(
			`select routines.id, "creatorId", "isPublic", name, goal, users.username as "creatorName" from routines 
            left join users on routines."creatorId" = users.id 
            where "isPublic" = true`
		);

		const { rows: rActivities } = await client.query(
			`select * from routine_activities 
            left join activities on routine_activities."activityId" = activities.id`
		);

		return addActivitiesToRoutines(routines, rActivities);
	} catch (err) {
		throw err;
	}
};

const getPublicRoutinesByUser = async ({ username }) => {
	try {
		const { rows: routines } = await client.query(
			`select routines.id, "creatorId", "isPublic", name, goal, users.username as "creatorName" from routines 
            left join users on routines."creatorId" = users.id 
            where "isPublic" = true and users.username = $1`,
			[username]
		);

		const { rows: rActivities } = await client.query(
			`select * from routine_activities 
            left join activities on routine_activities."activityId" = activities.id`
		);

		return addActivitiesToRoutines(routines, rActivities);
	} catch (err) {
		throw err;
	}
};

const getAllRoutinesByUser = async ({ username }) => {
	try {
		const { rows: routines } = await client.query(
			`select routines.id, "creatorId", "isPublic", name, goal, users.username as "creatorName" from routines 
            left join users on routines."creatorId" = users.id where users.username = $1`,
			[username]
		);

		const { rows: rActivities } = await client.query(
			`select * from routine_activities 
            left join activities on routine_activities."activityId" = activities.id`
		);

		return addActivitiesToRoutines(routines, rActivities);
	} catch (err) {
		throw err;
	}
};

const getPublicRoutinesByActivity = async ({ activityId }) => {
	try {
		const { rows: routines } = await client.query(
			`select routines.id, "creatorId", "isPublic", name, goal, users.username as "creatorName" from routines 
            left join users on routines."creatorId" = users.id 
            where "isPublic" = true`
		);

		const { rows: rActivities } = await client.query(
			`select * from routine_activities 
            left join activities on routine_activities."activityId" = activities.id`
		);

		let routinesWithActivities = addActivitiesToRoutines(
			routines,
			rActivities
		);

		let routineIdMatch = [];
		routinesWithActivities.forEach(routine => {
			routine.activities.forEach(activity => {
				if (activity.id === 4) {
					routineIdMatch.push(routine.id);
				}
			});
		});

		let routinesByActivityId = routinesWithActivities.filter(routine => {
			return routineIdMatch.includes(routine.id);
		});

		console.log(routinesByActivityId);
		return routinesByActivityId;
	} catch (err) {
		throw err;
	}
};

const getActivityById = async activityId => {
	try {
		const {
			rows: [activity]
		} = await client.query(`select * from activities where id = $1`, [
			activityId
		]);
		return activity;
	} catch (err) {
		throw err;
	}
};

const getRoutineById = async routineId => {
	try {
		const {
			rows: [routine]
		} = await client.query(`select * from routines where id = $1`, [
			routineId
		]);
		return routine;
	} catch (err) {
		throw err;
	}
};

const addActivitiesToRoutines = (routines, rActivities) => {
	routines.forEach(routine => {
		routine.activities = [];

		rActivities.forEach(rActivity => {
			if (routine.id === rActivity.routineId) {
				routine.activities.push(rActivity);
			}
		});
	});

	return routines;
};

const containsActivity = (activities, activityId) => {
	activities.forEach(activity => {
		if (activity.id === activityId) {
			return true;
		}
	});
};

module.exports = {
	createRoutine,
	updateRoutine,
	destroyRoutine,
	getRoutineActivitiesByRoutine,
	getRoutinesWithoutActivities,
	getAllRoutines,
	getAllPublicRoutines,
	getPublicRoutinesByUser,
	getAllRoutinesByUser,
	getPublicRoutinesByActivity,
	getActivityById,
	getRoutineById
};
