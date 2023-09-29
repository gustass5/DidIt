import { UserType } from '~/schema/Schema';
import { getTask } from './getTask';
import { json } from '@remix-run/node';
import { ActionError } from '~/errors/ActionError';

export const deleteTask = async (formData: FormData, user: UserType) => {
	const { taskData, taskSnapshot, listData } = await getTask(formData, user);

	if (taskData.author_id !== user.id && listData.author_id !== user.id) {
		throw new ActionError('You cannot delete task you did not create');
	}

	await taskSnapshot.ref.delete();

	return json({
		notification: { type: 'success', title: 'Success', text: 'Task deleted' }
	});
};
