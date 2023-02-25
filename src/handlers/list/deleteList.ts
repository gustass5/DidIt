import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { getListId } from '~/helpers/getListId';
import { ListSchema, UserSchema } from '~/schema/Schema';

export const deleteList = async (
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

	if (listData.author_id !== user.id) {
		throw new Error('You cannot delete this list');
	}

	const newListData = ListSchema.parse({
		...listData,
		deleted: true,
		updated_at: currentTimestamp
	});

	await listsSnapshot.ref.set(newListData);
};
