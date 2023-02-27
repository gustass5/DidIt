import { z } from 'zod';
import { UserSchema } from '~/schema/Schema';
import { getTask } from './getTask';

export const deleteTask = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const { taskData, taskSnapshot, listData } = await getTask(formData, user);

	if (taskData.author_id !== user.id && listData.author_id !== user.id) {
		throw new Error('You cannot delete task you did not create');
	}

	await taskSnapshot.ref.delete();
};
