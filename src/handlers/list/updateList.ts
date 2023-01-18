import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { ListSchema, UserSchema } from '~/schema/Schema';

export const updateList = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const name = formData.get('name');

	const currentTimestamp = new Date().toISOString();

	const listId = formData.get('listId');

	if (listId === null) {
		throw new Error('No list id provided');
	}

	if (typeof listId !== 'string') {
		throw new Error('List id is invalid');
	}

	// Get task snapshot so changes can be made to it
	const listsSnapshot = await FirebaseServer.database
		.collection('lists')
		.doc(listId)
		.get();

	if (!listsSnapshot.exists) {
		throw new Error('Task does not exist');
	}

	const listData = ListSchema.parse(listsSnapshot.data());

	if (listData.author_id !== user.id) {
		throw new Error('You cannot update list you did not create');
	}

	const newListData = ListSchema.parse({
		...listData,
		name,
		updated_at: currentTimestamp
	});

	await listsSnapshot.ref.set(newListData);
};
