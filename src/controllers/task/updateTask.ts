import { TaskSchema, UserType } from '~/schema/Schema';
import { getTask } from './getTask';
import { json } from '@remix-run/node';
import { ActionError } from '~/errors/ActionError';

export const updateTask = async (formData: FormData, user: UserType) => {
	const { taskData, taskSnapshot } = await getTask(formData, user);

	if (taskData.author_id !== user.id) {
		throw new ActionError('You cannot update task you did not create');
	}

	const name = formData.get('name');

	const labels = formData.get('labels');

	const currentTimestamp = new Date().toISOString();

	const newTaskData = TaskSchema.parse({
		...taskData,
		name,
		labels,
		updated_at: currentTimestamp
	});

	await taskSnapshot.ref.set(newTaskData);

	return json({
		notification: { type: 'success', title: 'Success', text: 'Task updated' }
	});
};
