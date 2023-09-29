import { ListSchema, UserType } from '~/schema/Schema';
import { getList } from './getList';
import { json } from '@remix-run/node';
import { ActionError } from '~/errors/ActionError';

export const updateList = async (formData: FormData, user: UserType) => {
	const name = formData.get('name');

	const currentTimestamp = new Date().toISOString();

	const { listData, listSnapshot } = await getList(formData, user);

	if (listData.author_id !== user.id) {
		throw new ActionError('You cannot update list you did not create');
	}

	const newListData = ListSchema.parse({
		...listData,
		name,
		updated_at: currentTimestamp
	});

	await listSnapshot.ref.set(newListData);

	return json({
		notification: { type: 'success', title: 'Success', text: 'List updated' }
	});
};
