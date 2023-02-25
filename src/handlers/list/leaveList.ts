import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { getListId } from '~/helpers/getListId';
import { ListSchema, UserSchema } from '~/schema/Schema';

export const leaveList = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const currentTimestamp = new Date().toISOString();

	const listId = getListId(formData);
	// Get task snapshot so changes can be made to it
	const listsSnapshot = await FirebaseServer.database
		.collection('lists')
		.doc(listId)
		.get();

	if (!listsSnapshot.exists) {
		throw new Error('List does not exist');
	}

	const listData = ListSchema.parse(listsSnapshot.data());

	if (!listData.participants[user.id]) {
		throw new Error('You are not part of this list');
	}

	const { [user.id]: _, ...participants } = listData.participants;

	const newListData = ListSchema.parse({
		...listData,
		participants,
		updated_at: currentTimestamp
	});

	await listsSnapshot.ref.set(newListData);
};
