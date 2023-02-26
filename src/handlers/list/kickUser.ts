import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { getListId } from '~/helpers/getListId';
import { ListSchema, UserSchema } from '~/schema/Schema';

export const kickUser = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const listId = getListId(formData);

	const userId = formData.get('userId');

	if (userId === null || typeof userId !== 'string') {
		throw new Error('User id is invalid');
	}

	// Get list snapshot so changes can be made to it
	const listsSnapshot = await FirebaseServer.database
		.collection('lists')
		.doc(listId)
		.get();

	if (!listsSnapshot.exists) {
		throw new Error('List does not exist');
	}

	const listData = ListSchema.parse(listsSnapshot.data());

	if (listData.deleted) {
		throw new Error('List is not accessible');
	}

	if (listData.author_id !== user.id) {
		throw new Error('You are not allowed to kick users');
	}

	if (listData.author_id === userId) {
		throw new Error('List author cannot be kicked');
	}

	if (listData.participants[userId] === undefined) {
		throw new Error('User is not on the list');
	}

	const { [userId]: _, ...participants } = listData.participants;

	const currentTimestamp = new Date().toISOString();

	const newListData = ListSchema.parse({
		...listData,
		participants,
		updated_at: currentTimestamp
	});

	await listsSnapshot.ref.set(newListData);
};
