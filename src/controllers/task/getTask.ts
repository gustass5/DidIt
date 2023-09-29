import { TaskSchema, UserType } from '~/schema/Schema';
import { getList } from '../list/getList';
import { ActionError } from '~/errors/ActionError';

export const getTask = async (formData: FormData, user: UserType) => {
	const taskId = formData.get('taskId');

	if (taskId === null) {
		throw new ActionError('No task id provided');
	}

	if (typeof taskId !== 'string') {
		throw new ActionError('Task id is invalid');
	}

	const { listData, listSnapshot } = await getList(formData, user);

	const taskSnapshot = await listSnapshot.ref.collection('tasks').doc(taskId).get();

	if (!taskSnapshot.exists) {
		throw new ActionError('Task does not exist');
	}

	const taskData = TaskSchema.parse({ id: taskSnapshot.id, ...taskSnapshot.data() });

	return { taskData, taskSnapshot, listData, listSnapshot };
};
