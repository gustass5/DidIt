import { TaskSchema, UserType } from '~/schema/Schema';
import { getTask } from './getTask';
import { json } from '@remix-run/node';
import { ActionError } from '~/errors/ActionError';

export const toggleComplete = async (formData: FormData, user: UserType) => {
	const { taskData, taskSnapshot } = await getTask(formData, user);

	if (taskData.responsible[user.id] === undefined) {
		throw new ActionError(
			'You cannot set task to be complete without being joined to it'
		);
	}

	if (taskData.completed[user.id] === undefined) {
		const newTaskData = TaskSchema.parse({
			...taskData,
			completed: {
				...taskData.completed,
				[user.id]: true
			}
		});

		await taskSnapshot.ref.set(newTaskData);

		return json({
			notification: {
				type: 'success',
				title: 'Success',
				text: 'Task completed'
			}
		});
	}

	const { [user.id]: current, ...rest } = taskData.completed;

	const newTaskData = TaskSchema.parse({
		...taskData,
		completed: {
			...rest
		}
	});

	await taskSnapshot.ref.set(newTaskData);

	return json({
		notification: {
			type: 'success',
			title: 'Success',
			text: 'Task is no longer set as complete'
		}
	});
};
