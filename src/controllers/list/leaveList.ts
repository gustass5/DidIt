import { ListSchema, UserType } from '~/schema/Schema';
import { getList } from './getList';
import { ActionError } from '~/errors/ActionError';
import { json } from '@remix-run/node';

export const leaveList = async (formData: FormData, user: UserType) => {
	const currentTimestamp = new Date().toISOString();

	const { listData, listSnapshot } = await getList(formData, user);

	if (!listData.participants[user.id]) {
		throw new ActionError('You are not part of this list');
	}

	if (listData.author_id === user.id) {
		throw new ActionError('You cannot leave list you created');
	}

	const { [user.id]: _, ...participants } = listData.participants;

	const newListData = ListSchema.parse({
		...listData,
		participants,
		updated_at: currentTimestamp
	});

	await listSnapshot.ref.set(newListData);

	return json({
		notification: { type: 'success', title: 'Success', text: 'You left the list' }
	});
};
