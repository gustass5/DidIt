import { ListSchema, UserType } from '~/schema/Schema';
import { getList } from './getList';
import { ActionError } from '~/errors/ActionError';
import { json } from '@remix-run/node';

export const kickUser = async (formData: FormData, user: UserType) => {
	const userId = formData.get('userId');

	if (userId === null || typeof userId !== 'string') {
		throw new ActionError('User id is invalid');
	}

	const { listData, listSnapshot } = await getList(formData, user);

	if (listData.author_id !== user.id) {
		throw new ActionError('You are not allowed to kick users');
	}

	if (listData.author_id === userId) {
		throw new ActionError('List author cannot be kicked');
	}

	if (listData.participants[userId] === undefined) {
		throw new ActionError('User is not on the list');
	}

	const { [userId]: _, ...participants } = listData.participants;

	const currentTimestamp = new Date().toISOString();

	const newListData = ListSchema.parse({
		...listData,
		participants,
		updated_at: currentTimestamp
	});

	await listSnapshot.ref.set(newListData);

	return json({
		notification: { type: 'success', title: 'Success', text: 'User kicked' }
	});
};
