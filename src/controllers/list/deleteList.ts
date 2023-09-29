import { ListSchema, UserType } from '~/schema/Schema';
import { getList } from './getList';
import { ActionError } from '~/errors/ActionError';
import { json } from '@remix-run/node';

export const deleteList = async (formData: FormData, user: UserType) => {
	const currentTimestamp = new Date().toISOString();

	const { listData, listSnapshot } = await getList(formData, user);

	if (listData.author_id !== user.id) {
		throw new ActionError('You cannot delete this list');
	}

	const newListData = ListSchema.parse({
		...listData,
		deleted: true,
		updated_at: currentTimestamp
	});

	await listSnapshot.ref.set(newListData);

	return json({
		notification: { type: 'success', title: 'Success', text: 'List deleted' }
	});
};
