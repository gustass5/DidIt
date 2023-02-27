import { z } from 'zod';
import { TaskSchema, UserSchema } from '~/schema/Schema';
import { getTask } from './getTask';

export const updateTask = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const { taskData, taskSnapshot } = await getTask(formData, user);

	if (taskData.author_id !== user.id) {
		throw new Error('You cannot update task you did not create');
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
};
