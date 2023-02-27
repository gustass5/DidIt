import { z } from 'zod';
import { ListSchema, UserSchema } from '~/schema/Schema';
import { getList } from './getList';

export const kickUser = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const userId = formData.get('userId');

	if (userId === null || typeof userId !== 'string') {
		throw new Error('User id is invalid');
	}

	const { listData, listSnapshot } = await getList(formData, user);

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

	await listSnapshot.ref.set(newListData);
};
