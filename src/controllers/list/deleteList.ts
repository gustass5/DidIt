import { ListSchema, UserType } from '~/schema/Schema';
import { getList } from './getList';

export const deleteList = async (formData: FormData, user: UserType) => {
	const currentTimestamp = new Date().toISOString();

	const { listData, listSnapshot } = await getList(formData, user);

	if (listData.author_id !== user.id) {
		throw new Error('You cannot delete this list');
	}

	const newListData = ListSchema.parse({
		...listData,
		deleted: true,
		updated_at: currentTimestamp
	});

	await listSnapshot.ref.set(newListData);
};