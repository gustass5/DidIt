import { z } from 'zod';
import { TaskSchema, UserSchema, ListSchema } from '~/schema/Schema';

export const deleteTask = async (
	taskSnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
	listData: z.infer<typeof ListSchema>,
	user: z.infer<typeof UserSchema>
) => {
	const taskData = TaskSchema.parse(taskSnapshot.data());

	if (taskData.author_id !== user.id && listData.author_id !== user.id) {
		throw new Error('You cannot delete task you did not create');
	}

	await taskSnapshot.ref.delete();
};
