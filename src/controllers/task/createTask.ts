import { TaskSchema, UserType } from '~/schema/Schema';
import { getList } from '../list/getList';
import { json } from '@remix-run/node';

export const createTask = async (formData: FormData, user: UserType) => {
	const name = formData.get('name');

	const labels = formData.get('labels');

	const currentTimestamp = new Date().toISOString();

	const newTask = TaskSchema.parse({
		name,
		author_id: user.id,
		responsible: {
			// [TODO]: Make a decision if user should be responsible for newly created task by default
			// [user.uid]: { name: user.name, email: user.email, image: user.picture }
		},
		completed: {},
		labels,
		created_at: currentTimestamp,
		updated_at: currentTimestamp
	});

	const { listSnapshot } = await getList(formData, user);

	await listSnapshot.ref.collection('tasks').add(newTask);

	return json({
		notification: { type: 'success', title: 'Success', text: 'Task created' }
	});
};
