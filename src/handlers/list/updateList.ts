import { z } from 'zod';
import { ListSchema, UserSchema } from '~/schema/Schema';
import { getList } from './getList';

export const updateList = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const name = formData.get('name');

	const currentTimestamp = new Date().toISOString();

	const { listData, listSnapshot } = await getList(formData);

	if (listData.author_id !== user.id) {
		throw new Error('You cannot update list you did not create');
	}

	const newListData = ListSchema.parse({
		...listData,
		name,
		updated_at: currentTimestamp
	});

	await listSnapshot.ref.set(newListData);
};
