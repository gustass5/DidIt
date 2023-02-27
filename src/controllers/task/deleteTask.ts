import { UserType } from '~/schema/Schema';
import { getTask } from './getTask';

export const deleteTask = async (formData: FormData, user: UserType) => {
	const { taskData, taskSnapshot, listData } = await getTask(formData, user);

	if (taskData.author_id !== user.id && listData.author_id !== user.id) {
		throw new Error('You cannot delete task you did not create');
	}

	await taskSnapshot.ref.delete();
};
