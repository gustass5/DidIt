import { ListSchema, UserType } from '~/schema/Schema';
import { getList } from './getList';

export const leaveList = async (formData: FormData, user: UserType) => {
	const currentTimestamp = new Date().toISOString();

	const { listData, listSnapshot } = await getList(formData, user);

	if (!listData.participants[user.id]) {
		throw new Error('You are not part of this list');
	}

	if (listData.author_id === user.id) {
		throw new Error('You cannot leave list you created');
	}

	const { [user.id]: _, ...participants } = listData.participants;

	const newListData = ListSchema.parse({
		...listData,
		participants,
		updated_at: currentTimestamp
	});

	await listSnapshot.ref.set(newListData);
};
