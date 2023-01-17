import { z } from 'zod';
import { TaskSchema, UserSchema } from '~/schema/Schema';

export const toggleComplete = async (
	taskSnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
	user: z.infer<typeof UserSchema>
) => {
	const taskData = TaskSchema.parse(taskSnapshot.data());

	if (taskData.responsible[user.id] === undefined) {
		throw new Error(
			'You cannot set task to be complete without being joined to it'
		);
	}

	if (taskData.completed[user.id] === undefined) {
		const newTaskData = {
			...taskData,
			completed: {
				...taskData.completed,
				[user.id]: true
			}
		};

		await taskSnapshot.ref.set(newTaskData);
	} else {
		const { [user.id]: current, ...rest } = taskData.completed;

		const newTaskData = {
			...taskData,
			completed: {
				...rest
			}
		};

		await taskSnapshot.ref.set(newTaskData);
	}
};
