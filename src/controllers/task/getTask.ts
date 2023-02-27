import { z } from 'zod';
import { TaskSchema, UserSchema } from '~/schema/Schema';
import { getList } from '../list/getList';

export const getTask = async (formData: FormData, user: z.infer<typeof UserSchema>) => {
	const taskId = formData.get('taskId');

	if (taskId === null) {
		throw new Error('No task id provided');
	}

	if (typeof taskId !== 'string') {
		throw new Error('Task id is invalid');
	}

	const { listData, listSnapshot } = await getList(formData, user);

	const taskSnapshot = await listSnapshot.ref.collection('tasks').doc(taskId).get();

	if (!taskSnapshot.exists) {
		throw new Error('Task does not exist');
	}

	const taskData = TaskSchema.parse({ id: taskSnapshot.id, ...taskSnapshot.data() });

	return { taskData, taskSnapshot, listData, listSnapshot };
};
