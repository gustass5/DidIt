import { z } from 'zod';
import { TaskSchema, UserSchema } from '~/schema/Schema';

export const createTask = async (
	listSnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
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

	await listSnapshot.ref.collection('tasks').add(newTask);
};
